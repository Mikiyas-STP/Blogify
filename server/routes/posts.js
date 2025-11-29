// server/routes/posts.js (The CORRECT Back-End Code)
const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all posts
router.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM posts ORDER BY created_at DESC;";
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
    const sql = 'SELECT * FROM posts WHERE id = $1';
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
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const sql = 'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *;';
    const values = [title, content];
    const result = await db.query(sql, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

// PUT (update) a post by ID
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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