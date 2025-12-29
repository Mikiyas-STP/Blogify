//Back-End Code
const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require('../middleware/auth'); //import authentication middleware
//imports for the image upload
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
//configure multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

// --- NEW IMAGE UPLOAD ROUTE ---
/**
 * @route   POST /api/posts/upload
 * @desc    Upload an image for a post
 * @access  Private
 */
router.post('/upload', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "blogify_posts" },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload image.' });
        }
        res.status(201).json({ 
          url: result.secure_url,
          public_id: result.public_id});
      }
    );
    // Pipe the file buffer into the upload stream
    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error('Upload route error:', err);
    res.status(500).json({ error: 'An error occurred during image upload.' });
  }
});

// POST (create) a new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const authorId = req.user.id;
    const { title, content, cover_image_url, cover_image_public_id } = req.body;
    const sql = 'INSERT INTO posts (title, content, author_id, cover_image_url, cover_image_public_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
    const values = [title, content, authorId, cover_image_url || null, cover_image_public_id || null];
    const result = await db.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

// GET all posts
router.get("/", async (req, res) => {
  try {
    const sql = `SELECT posts.id, posts.title, posts.content, posts.created_at, posts.cover_image_url, users.username FROM posts JOIN users ON posts.author_id = users.id ORDER BY posts.created_at DESC;`;
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
});

// GET a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `SELECT posts.id, posts.title, posts.content, posts.created_at, posts.cover_image_url, users.username FROM posts JOIN users ON posts.author_id = users.id WHERE posts.id = $1;`;
    const values = [id];
    const result = await db.query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: 'An error occurred while fetching the post.' });
  }
});

// PUT (update) a post by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, cover_image_url, cover_image_public_id } = req.body;
    //Get the current post from the database to find the old public_id
    const currentPostResult = await db.query('SELECT cover_image_public_id FROM posts WHERE id = $1', [id]);
    if (currentPostResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found." });
    }
    const oldPublicId = currentPostResult.rows[0].cover_image_public_id;
    //Check if the image has changed and if there was an old one to delete
    if (oldPublicId && oldPublicId !== cover_image_public_id) {
      console.log(`Deleting old image from Cloudinary: ${oldPublicId}`);
      await cloudinary.uploader.destroy(oldPublicId);
    }
    //Now update the database with the new information
    const sql = `
      UPDATE posts 
      SET title = $1, content = $2, cover_image_url = $3, cover_image_public_id = $4
      WHERE id = $5 RETURNING *;
    `;
    const values = [title, content, cover_image_url, cover_image_public_id, id];
    const result = await db.query(sql, values);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).json({ error: "An error occurred while updating the post." });
  }
});

// DELETE a post by ID
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "DELETE FROM posts WHERE id = $1 RETURNING *;";
    const values = [id];
    const result = await db.query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found." });
    }
    res.json({ message: `Post with ID ${id} was deleted successfully.` });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: "An error occurred while deleting the post." });
  }
});


// ... (at the end of the file, before module.exports)
/**
 * @route   GET /api/posts/:postId/comments
 * @desc    Get all comments for a specific post
 * @access  Public
 */
router.get('/:postId/comments', async (req, res) => {
  try {
    const { postId } = req.params;

    const sql = `
      SELECT 
        comments.id, 
        comments.content, 
        comments.created_at, 
        users.username 
      FROM comments
      JOIN users ON comments.author_id = users.id
      WHERE comments.post_id = $1
      ORDER BY comments.created_at DESC; -- Show newest comments first
    `;
    const values = [postId];

    const result = await db.query(sql, values);
    res.json(result.rows);

  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'An error occurred while fetching comments.' });
  }
});

/**
 * @route   POST /api/posts/:postId/comments
 * @desc    Create a new comment on a post
 * @access  Private
 */
router.post('/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const authorId = req.user.id;
    const { content, parent_comment_id } = req.body; // parent_comment_id is optional

    if (!content) {
      return res.status(400).json({ error: 'Comment content cannot be empty.' });
    }

    // Insert the comment and get the new comment's ID
    const insertSql = `
      INSERT INTO comments (content, author_id, post_id, parent_comment_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id;
    `;
    const insertValues = [content, authorId, postId, parent_comment_id];
    const insertResult = await db.query(insertSql, insertValues);
    const newCommentId = insertResult.rows[0].id;

    // Fetch the full comment with the author's username to send back to the client
    const selectSql = `
      SELECT comments.id, comments.content, comments.created_at, users.username 
      FROM comments
      JOIN users ON comments.author_id = users.id
      WHERE comments.id = $1;
    `;
    const finalResult = await db.query(selectSql, [newCommentId]);

    res.status(201).json(finalResult.rows[0]);

  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'An error occurred while creating a comment.' });
  }
});


/**
 * @route   GET /api/posts/:postId/reactions
 * @desc    Get all reactions for a specific post, grouped by type
 * @access  Public
 */
router.get('/:postId/reactions', async (req, res) => {
  try {
    const { postId } = req.params;
    //advanced SQL query
    const sql = `
      SELECT 
        reaction_type, 
        COUNT(*) as count,
        ARRAY_AGG(users.username) as users
      FROM reactions
      JOIN users ON reactions.user_id = users.id
      WHERE post_id = $1
      GROUP BY reaction_type;
    `;
    const result = await db.query(sql, [postId]);
    //The result will be an array of objects, e.g.:
    //[ { reaction_type: 'like', count: '5', users: ['userA', 'userB', ...] } ]
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching reactions:', err);
    res.status(500).json({ error: 'An error occurred while fetching reactions.' });
  }
});

/**
 * @route   POST /api/posts/:postId/react
 * @desc    Add, update, or remove a reaction on a post
 * @access  Private
 */
router.post('/:postId/react', authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    const { reaction_type } = req.body;

    // Basic validation
    if (!reaction_type) {
      return res.status(400).json({ error: 'Reaction type is required.' });
    }

    const existingReaction = await db.query(
      'SELECT * FROM reactions WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (existingReaction.rows.length > 0) {
      const currentReaction = existingReaction.rows[0];

      if (currentReaction.reaction_type === reaction_type) {
        //They clicked the same reaction again. We DELETE it (un-react).
        await db.query('DELETE FROM reactions WHERE id = $1', [currentReaction.id]);
        res.json({ message: 'Reaction removed.' });
      } else {
        //They clicked a different reaction. We UPDATE their existing one.
        const result = await db.query(
          'UPDATE reactions SET reaction_type = $1 WHERE id = $2 RETURNING *',
          [reaction_type, currentReaction.id]
        );
        res.json(result.rows[0]);
      }
    } else {
      //The user has no reaction yet. We INSERT a new one.
      const result = await db.query(
        'INSERT INTO reactions (reaction_type, user_id, post_id) VALUES ($1, $2, $3) RETURNING *',
        [reaction_type, userId, postId]
      );
      res.status(201).json(result.rows[0]);
    }

  } catch (err) {
    //this can happen if a user tries to react twice very quickly
    //the UNIQUE constraint in our database will fire, and this catch block will handle it.
    if (err.code === '23505') { // '23505' is the code for a unique violation
        return res.status(409).json({ error: 'Reaction conflict. Please try again.' });
    }
    console.error('Error handling reaction:', err);
    res.status(500).json({ error: 'An error occurred while handling the reaction.' });
  }
});

module.exports = router;