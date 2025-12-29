// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //importing jsonwebtoken library
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

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and get a token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    // 1. Get email and password from the request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 2. Find the user in the database by their email
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // IMPORTANT: Use a generic error message for security.
      // Do not tell the attacker whether the email exists or not.
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const user = userResult.rows[0];

    // 3. Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      // If the passwords do not match, send the same generic error.
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // 4. If credentials are correct, create the JWT "wristband"
    const payload = {
      user: {
        id: user.id, // This is the information we are putting inside the token
        username: user.username 
      },
    };

    // 5. Sign the token with our secret key
    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Get the secret from our .env file
      { expiresIn: '1h' }, // The token will be valid for 1 hour
      (err, token) => {
        if (err) throw err;
        // 6. Send the token back to the client
        res.json({ token });
      }
    );

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'An error occurred on the server during login.' });
  }
});


module.exports = router;