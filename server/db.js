const { Pool } = require("pg");

const pool = new Pool({
  user: "mikiyasgebremichael",
  host: "localhost",
  database: "mikiyasgebremichael", 
  password: "",
  port: 5432,
});

module.exports = pool;
