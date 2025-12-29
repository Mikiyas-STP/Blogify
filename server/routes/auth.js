// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); //importing jsonwebtoken library
const db = require('../db');
const router = express.Router();
const saltRounds = 10; //a std value for the "cost" of hashing
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    //get username, email, and password from the request body
    const { username, email, password } = req.body;
    //basic validation: Check if required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }
    //check if the user already exists in the database
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'A user with this email already exists.' });
    }
    //hash the password using bcrypt
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    //insert the new user into the database with the hashed password
    const sql = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *;';
    const values = [username, email, passwordHash];
    const result = await db.query(sql, values);
    const newUser = result.rows[0];
    //send a success response (DO NOT send the password hash back)
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
    //get email and password from the request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    //Find the user in the database by their email
    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      //same error to prevent attackers knew about soecfic details.
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const user = userResult.rows[0];

    //compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      //if the passwords do not match, send the same generic error.
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    //if credentials are correct, create the JWT "wristband"
    const payload = {
      user: {
        id: user.id, //this infos are putting inside the token
        username: user.username 
      },
    };

    //sign the token with our secret key
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        //send the token back to the client
        res.json({ token });
      }
    );

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'An error occurred on the server during login.' });
  }
});


module.exports = router;