-- Active: 1691383653504@@127.0.0.1@5432@realworld_express_raw

DROP TABLE blog_user

-- Create user table
CREATE TABLE blog_user (
  id SERIAL PRIMARY KEY NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  username VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(50) NOT NULL,
  bio VARCHAR(300),
  image VARCHAR(1024)
)