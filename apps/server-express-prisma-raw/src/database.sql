-- Active: 1691383653504@@127.0.0.1@5432@realworld_express_raw

DROP TABLE blog_user 

-- Create user table

CREATE TABLE
    blog_user (
        id SERIAL PRIMARY KEY NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        username VARCHAR(20) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        bio VARCHAR(300),
        image VARCHAR(1024)
    )

DROP TABLE blog_article 

CREATE TABLE
    blog_article (
        id SERIAL PRIMARY KEY NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        title VARCHAR(100) UNIQUE NOT NULL,
        description VARCHAR(255) UNIQUE NOT NULL,
        body VARCHAR(65535) UNIQUE NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        author_id INTEGER NOT NULL,
        CONSTRAINT blog_article_author_id_fkey FOREIGN KEY ("author_id") REFERENCES blog_user("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )