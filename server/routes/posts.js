// server/routes/posts.js (The CORRECT Back-End Code)
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
        //on success, Cloudinary gives us the result object
        res.status(201).json({ url: result.secure_url });
      }
    );
    // Pipe the file buffer into the upload stream
    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error('Upload route error:', err);
    res.status(500).json({ error: 'An error occurred during image upload.' });
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
    const sql = `SELECT posts.id, posts.title, posts.content, posts.created_at, users.username FROM posts JOIN users ON posts.author_id = users.id WHERE posts.id = $1;`;
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

// POST (create) a new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const authorId = req.user.id;
    const { title, content, cover_image_url } = req.body;
    const sql = 'INSERT INTO posts (title, content, author_id, cover_image_url) VALUES ($1, $2, $3, $4) RETURNING *;';
    const values = [title, content, authorId, cover_image_url];
    const result = await db.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

// PUT (update) a post by ID
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const sql = "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *;";
    const values = [title, content, id];
    const result = await db.query(sql, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Post not found." });
    }
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

module.exports = router;