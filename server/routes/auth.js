// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // Our database pool
const router = express.Router();
const saltRounds = 10; // A standard value for the "cost" of hashing
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    // 1. Get username, email, and password from the request body
    const { username, email, password } = req.body;

    // Basic validation: Check if required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    // 2. Check if the user already exists in the database
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }

    // 3. Hash the password using bcrypt
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Insert the new user into the database with the hashed password
    const sql = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *;';
    const values = [username, email, passwordHash];
    
    const result = await db.query(sql, values);
    const newUser = result.rows[0];

    // 5. Send a success response (DO NOT send the password hash back)
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      created_at: newUser.created_at,
    });

  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'An error occurred on the server during registration.' });
  }
});

module.exports = router;