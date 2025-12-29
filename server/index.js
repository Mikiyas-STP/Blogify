require('dotenv').config();
//my express server
const express = require("express");
const cors = require('cors');
const postsRouter = require("./routes/posts");
const authRouter = require('./routes/auth');

const commentsRouter = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 5001;

//midddleware
// CORS configuration - allow all origins in production (adjust as needed)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
})); 
app.use(express.json()); //middleware for my server to read json from req body
app.use('/api/comments', commentsRouter);

//routes
app.use("/api/posts", postsRouter);
app.use('/api/auth', authRouter);//Use the auth router for /api/auth
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//npm run dev is like saying npm run vite since it is defined by the developer of vite tool.
