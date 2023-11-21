import pool from '../../../app/db';

export const getArticleBySlug = async (slug: string, followerId: number) => {
  return await pool.query(
    `
  SELECT
      blog_article.body, (blog_article.created_at) AS "createdAt",
      blog_article.description,
      blog_article.id,
      blog_article.slug, (blog_article.updated_at) AS "updatedAt", (blog_article.author_id) AS "authorId",
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
              favorited_article.author_id
          )
      ) AS favorited_article
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
      LEFT JOIN (
          SELECT
              follower_id,
              following_id
          FROM blog_follows
          WHERE
              follower_id = $2
      ) AS current_user_following ON current_user_following.following_id = blog_user.id
      LEFT JOIN blog_favorites AS favorited_article ON favorited_article.author_id = blog_user.id
  WHERE blog_article.slug = $1
  GROUP BY
      blog_user.username,
      blog_user.image,
      blog_article.id,
      favorites_count.total_favorites,
      favorited_article.author_id,
      current_user_following.follower_id
  `,
    [slug, followerId],
  );
};

export default getArticleBySlug;
