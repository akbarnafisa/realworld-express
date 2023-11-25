import pool from '../../../app/db';

const getFeedByPagination = async (followerId: number, limit: number, offset: number) => {
  return await pool.query(
    `
  SELECT
      blog_article.body, (blog_article.created_at) AS "createdAt",
      blog_article.title,
      blog_article.description,
      blog_article.id,
      blog_article.slug,
      blog_article.updated_at AS "updatedAt",
      blog_article.author_id AS "authorId",
      json_build_object(
          'username',
          blog_user.username,
          'image',
          blog_user.image,
          'followedBy',
          json_build_array(
              json_build_object(
                  'followerId',
                  current_user_following.follower_id
              )
          )
      ) AS author,
      jsonb_agg(
          jsonb_build_object(
              'tag',
              jsonb_build_object('name', blog_tag.name)
          )
      ) AS tags,
      jsonb_build_object(
          'favoritedBy',
          COALESCE(
              favorites_count.total_favorites,
              0
          )
      ) AS _count,
      json_build_array(
          jsonb_build_object(
              'userId',
              favorited.author_id
          )
      ) AS "favoritedBy"
  FROM blog_article
      JOIN blog_articles_tags ON blog_articles_tags.article_id = blog_article.id
      JOIN blog_tag ON blog_articles_tags.tag_id = blog_tag.id
      JOIN blog_user ON blog_user.id = blog_article.author_id
      LEFT JOIN (
          SELECT
              article_id,
              COUNT(*) as total_favorites
          FROM blog_favorites
          GROUP BY
              article_id
      ) AS favorites_count ON favorites_count.article_id = blog_article.id
     JOIN (
          SELECT
              follower_id,
              following_id
          FROM blog_follows
          WHERE
              follower_id = $1
      ) AS current_user_following ON current_user_following.following_id = blog_user.id
      LEFT JOIN blog_favorites AS favorited ON favorited.author_id = $1 AND favorited.article_id = blog_article.id
  GROUP BY
      blog_user.username,
      blog_user.image,
      blog_article.id,
      favorites_count.total_favorites,
      favorited.author_id,
      current_user_following.follower_id
    ORDER BY
        blog_article.created_at DESC
  LIMIT $2
  OFFSET $3

  `,
    [followerId, limit, offset],
  );
};

const getFeedByCursor = async (authId: number, limit: number, cursor: number) => {
  const query = `
    SELECT
      blog_article.body, (blog_article.created_at) AS "createdAt",
      blog_article.title,
      blog_article.description,
      blog_article.id,
      blog_article.slug,
      blog_article.updated_at AS "updatedAt",
      blog_article.author_id AS "authorId",
      json_build_object(
          'username',
          blog_user.username,
          'image',
          blog_user.image,
          'followedBy',
          json_build_array(
              json_build_object(
                  'followerId',
                  current_user_following.follower_id
              )
          )
      ) AS author,
      jsonb_agg(
          jsonb_build_object(
              'tag',
              jsonb_build_object('name', blog_tag.name)
          )
      ) AS tags,
      jsonb_build_object(
          'favoritedBy',
          COALESCE(
              favorites_count.total_favorites,
              0
          )
      ) AS _count,
      json_build_array(
          jsonb_build_object(
              'userId',
              favorited.author_id
          )
      ) AS "favoritedBy"
    FROM blog_article
      JOIN blog_articles_tags ON blog_articles_tags.article_id = blog_article.id
      JOIN blog_tag ON blog_articles_tags.tag_id = blog_tag.id
      JOIN blog_user ON blog_user.id = blog_article.author_id
      LEFT JOIN (
          SELECT
              article_id,
              COUNT(*) as total_favorites
          FROM blog_favorites
          GROUP BY
              article_id
      ) AS favorites_count ON favorites_count.article_id = blog_article.id
      JOIN (
          SELECT
              follower_id,
              following_id
          FROM blog_follows
          WHERE
              follower_id = $1
      ) AS current_user_following ON current_user_following.following_id = blog_user.id
      LEFT JOIN blog_favorites AS favorited ON favorited.author_id = $1 AND favorited.article_id = blog_article.id
    WHERE (
      blog_article.created_at < (
          SELECT blog_article.created_at FROM blog_article WHERE blog_article.id = $2
      )
    )
    GROUP BY
      blog_user.username,
      blog_user.image,
      blog_article.id,
      favorites_count.total_favorites,
      favorited.author_id,
      current_user_following.follower_id
    ORDER BY
      blog_article.created_at DESC
    LIMIT $3
    OFFSET 0

  `;

  return await pool.query(query, [authId, cursor, limit]);
};

export const getFeed = async (authId: number, limit: number = 10, offset: number = 0, cursor?: number) => {
  if (cursor) {
    return getFeedByCursor(authId, limit, cursor);
  }

  return getFeedByPagination(authId, limit, offset);
};

export default getFeed;
