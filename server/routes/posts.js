// server/routes/posts.js

const express = require("express");
const router = express.Router();
const db = require("../db"); // Our database connection pool

/**
 * @route   GET /api/posts
 * @desc    Get all posts, ordered by the newest first
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    // The SQL query to get all posts
    const sql = "SELECT * FROM posts ORDER BY created_at DESC;";

    // Execute the query
    const result = await db.query(sql);

    // Send the results back to the client
    res.json(result.rows);
  } catch (err) {
    // Log the error to the console for debugging
    console.error("Error fetching posts:", err);

    // Send a 500 Internal Server Error response to the client
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
});

/**
 * @route   GET /api/posts/:id
 * @desc    Get a single post by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameters

    const sql = 'SELECT * FROM posts WHERE id = $1';
    const values = [id]; // The array of values to substitute for $1, $2, etc.

    const result = await db.query(sql, values);

    // Check if a post was actually found
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Send the first (and only) row from the results
    res.json(result.rows[0]);

  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: 'An error occurred while fetching the post.' });
  }
});


/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Private (we will secure it later)
 */
router.post('/', async (req, res) => {
  try {
    // 1. Get title and content from the request body
    const { title, content } = req.body;
    // 2. Define the SQL query with placeholders
    const sql = 'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *;';
    // 3. Define the values array
    const values = [title, content];
    // 4. Execute the query
    const result = await db.query(sql, values);
    // 5. Send the response
    // Hint: The new post is in result.rows[0]
    // Hint: Use res.status(201).json(...)
    res.status(201).json(result.rows[0])

  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

/**
 * @route   POST /api/posts/:id
 * @desc    Replace or Update a post
 * @access  Private (we will secure it later)
 */
router.put("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get id from req.params
    const { title, content } = req.body;
    // 2. Define the SQL query with placeholders
    const sql =
      "UPDATE posts SET title = $1, content = $2 WHERE id = $3 RETURNING *;";
    
    const values = [title, content , id];
    const result = await db.query(sql, values);
    if (result.rows.length === 0) {
      console.error(404);
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating post:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
});

/**
 * @route   POST /api/posts/:id
 * @desc    delete a specific post
 * @access  Private (we will secure it later)
 */
router.delete("/api/posts/:id", async (req, res) => {
  try {
    const { id } = req.params; // Get id from req.params
    const { title, content } = req.body;
    // 2. Define the SQL query with placeholders
    const sql ="DELETE FROM posts WHERE id = $1 RETURNING *";
    const values = [id];
    const result = await db.query(sql, values);
    if (result.rows.length === 0) {
      console.error(404);
    }
    res.status(204).json();
    res.json({ message: `Post with ID ${id} was deleted successfully.` });
  } catch (err) {
    console.error("Error creating post:", err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
});

module.exports = router;
