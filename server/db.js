// server/db.js (Updated and Secure)
const { Pool } = require('pg');
// The pool will now read the connection details from the environment variables
// that were loaded by 'dotenv'.
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;