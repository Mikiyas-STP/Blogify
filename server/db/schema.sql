-- This script defines the complete database schema for the Blogify application.
-- It is designed to be run on a clean database.

-- The DROP TABLE commands are included to allow for easy resets during development.
-- The 'CASCADE' option will automatically remove any dependent objects.
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- This is the foreign key that links each post to an author.
  -- It is an integer that MUST match an 'id' in the 'users' table.
  -- We have set it to NOT NULL to ensure every post has an author.
  author_id INTEGER NOT NULL REFERENCES users(id)
);