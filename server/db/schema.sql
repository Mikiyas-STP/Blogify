-- This script defines the complete database schema for the Blogify application.
-- It is designed to be run on a clean database and is idempotent (can be run multiple times).
-- The DROP statements are included to allow for easy resets during development.
-- 'CASCADE' automatically removes dependent objects (like foreign key constraints).
DROP TABLE IF EXISTS reactions;
DROP TABLE IF EXISTS comments;
DROP TABLE IzF EXISTS posts;
DROP TABLE IF EXISTS users;

-- Create the 'users' table first, as other tables will reference it.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL, -- Usernames should also be unique
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'posts' table.
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  cover_image_public_id TEXT, -- To store the Cloudinary public_id for deletion
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create the 'comments' table for nested comments.
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  parent_comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'reactions' table with a unique composite key.
CREATE TABLE reactions (
  id SERIAL PRIMARY KEY,
  reaction_type VARCHAR(50) NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, post_id) -- A user can only have one reaction per post.
);