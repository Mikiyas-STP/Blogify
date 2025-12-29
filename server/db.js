// server/db.js (Production Ready)
const { Pool } = require('pg');

// This configuration object will be used for local development
const pool = new Pool ({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false ,
});

pool.on("connect", () => {
  console.log("✅ Database connected successfully");
});
pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err);
});


(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Database connection test passed");
  } catch (err) {
    console.error("❌ Database connection test failed:", err.message);
  }
})();


// Render provides a single DATABASE_URL environment variable.
// The 'pg' library automatically uses this if it exists.
// const prodConfig = {
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// };
// Use the production config if the DATABASE_URL is available, otherwise use local.
//const pool = new Pool(process.env.DATABASE_URL ? prodConfig : localConfig);

module.exports = pool;