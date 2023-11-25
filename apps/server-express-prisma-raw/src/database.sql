-- Active: 1691383653504@@127.0.0.1@5432@realworld_express_raw

-- Create user table

CREATE TABLE
    blog_user (
        id SERIAL NOT NULL,
        email VARCHAR(100) NOT NULL,
        username VARCHAR(20) NOT NULL,
        password TEXT NOT NULL,
        bio VARCHAR(300),
        image VARCHAR(1024),
        CONSTRAINT blog_user_pkey PRIMARY KEY (id),
        CONSTRAINT blog_user_email_key UNIQUE (email),
        CONSTRAINT blog_user_username_key UNIQUE (username)
    )

CREATE TABLE
    blog_favorites (
        article_id INTEGER NOT NULL,
        author_id INTEGER NOT NULL,
        CONSTRAINT blog_favorites_pkey PRIMARY KEY (article_id, author_id),
        CONSTRAINT blog_favorites_article_id_fkey FOREIGN KEY (article_id) REFERENCES blog_article(id) ON DELETE CASCADE,
        CONSTRAINT blog_favorites_author_id_fkey FOREIGN KEY (author_id) REFERENCES blog_user(id) ON DELETE CASCADE,
        CONSTRAINT blog_article_author_id_fkey FOREIGN KEY (author_id) REFERENCES blog_user(id) ON DELETE RESTRICT ON UPDATE CASCADE
    )

CREATE TABLE
    blog_follows (
        follower_id INTEGER NOT NULL,
        following_id INTEGER NOT NULL,
        CONSTRAINT blog_follows_pkey PRIMARY KEY (follower_id, following_id),
        CONSTRAINT blog_follows_follower_id FOREIGN KEY (follower_id) REFERENCES blog_user (id) ON DELETE CASCADE,
        CONSTRAINT blog_follows_following_id FOREIGN KEY (following_id) REFERENCES blog_user (id) ON DELETE CASCADE
    )

CREATE TABLE
    blog_article (
        id SERIAL NOT NULL,
        slug TEXT NOT NULL,
        title VARCHAR(100) NOT NULL,
        description VARCHAR(255) NOT NULL,
        body VARCHAR(65535) NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        author_id INTEGER NOT NULL,
        CONSTRAINT blog_article_pkey PRIMARY KEY (id),
        CONSTRAINT blog_article_slug_key UNIQUE (slug),
        CONSTRAINT blog_article_author_id_fkey FOREIGN KEY (author_id) REFERENCES blog_user (id) ON DELETE CASCADE
    )

CREATE TABLE
    blog_comment (
        id SERIAL NOT NULL,
        created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        body TEXT NOT NULL,
        author_id INTEGER NOT NULL,
        article_id INTEGER NOT NULL,
        CONSTRAINT blog_comment_pkey PRIMARY KEY (id),
        CONSTRAINT blog_comment_author_id_fkey FOREIGN KEY (author_id) REFERENCES blog_user (id) ON DELETE CASCADE,
        CONSTRAINT blog_comment_article_id_fkey FOREIGN KEY (article_id) REFERENCES blog_article (id) ON DELETE CASCADE
    )

CREATE TABLE
    blog_articles_tags (
        article_id INTEGER NOT NULL,
        tag_id INTEGER NOT NULL,
        CONSTRAINT blog_articles_tags_pkey PRIMARY KEY (article_id, tag_id),
        CONSTRAINT blog_articles_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES blog_tag (id) ON DELETE CASCADE,
        CONSTRAINT blog_articles_tags_article_id_fkey FOREIGN KEY (article_id) REFERENCES blog_article (id) ON DELETE CASCADE
    )

CREATE TABLE
    blog_tag (
        id SERIAL NOT NULL,
        name VARCHAR(100) NOT NULL,
        CONSTRAINT blog_tag_pkey PRIMARY KEY (id),
        CONSTRAINT blog_tag_name_key UNIQUE (name)
    )

