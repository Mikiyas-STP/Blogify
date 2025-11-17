// server/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "screenshareuk",
  host: "localhost",
  database: "screenshareuk", 
  password: "",
  port: 5432,
});

module.exports = pool;
