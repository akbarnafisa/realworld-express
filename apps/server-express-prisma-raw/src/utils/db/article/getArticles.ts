import pool from '../../../app/db';

export type ArticlesQueries = { tag?: string; author?: string; favorited?: string };

export const getWhereData = (queries: ArticlesQueries, indexStart = 4) => {
  const whereValues = Object.values(queries).filter(Boolean);
  const whereQueries = Object.keys(queries)
    .filter((key) => {
      const keyData = key as keyof typeof queries;
      return queries[keyData];
    })
    .map((key, index) => {
      if (key === 'tag') {
        return `blog_tag.name = $${index + indexStart}`;
      } else if (key === 'author') {
        return `blog_user.username = $${index + indexStart}`;
      }
      return `favorited_query.username = $${index + indexStart}`;
    })
    .join(' AND ');

  return {
    whereValues,
    whereQueries,
  };
};

const getArticlesByPagination = async (
  authId: number | undefined,
  limit: number,
  offset: number,
  queries: ArticlesQueries,
) => {
  const { whereValues, whereQueries } = getWhereData(queries);
  const query = `
  SELECT
      blog_article.body, (blog_article.created_at) AS "createdAt",
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
      LEFT JOIN (
          SELECT
              follower_id,
              following_id
          FROM blog_follows
          WHERE
              follower_id = $1
      ) AS current_user_following ON current_user_following.following_id = blog_user.id
      LEFT JOIN blog_favorites AS favorited ON favorited.author_id = $1 AND favorited.article_id = blog_article.id
      LEFT JOIN blog_favorites ON blog_favorites.article_id = blog_article.id
      LEFT JOIN blog_user AS favorited_query ON favorited_query.id = blog_favorites.author_id
  ${whereValues.length ? `WHERE ${whereQueries}` : ''}
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
  `;

  const values = [authId, limit, offset, ...whereValues];

  return await pool.query(query, values);
};

const getArticlesByCursor = async (
  authId: number | undefined,
  limit: number,
  cursor: number,
  queries: ArticlesQueries,
) => {
  const { whereValues, whereQueries } = getWhereData(queries);

  const query = `
    SELECT
      blog_article.body, (blog_article.created_at) AS "createdAt",
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
      LEFT JOIN (
          SELECT
              follower_id,
              following_id
          FROM blog_follows
          WHERE
              follower_id = $1
      ) AS current_user_following ON current_user_following.following_id = blog_user.id
      LEFT JOIN blog_favorites AS favorited ON favorited.author_id = $1 AND favorited.article_id = blog_article.id
      LEFT JOIN blog_favorites ON blog_favorites.article_id = blog_article.id
      LEFT JOIN blog_user AS favorited_query ON favorited_query.id = blog_favorites.author_id
    WHERE (
      blog_article.created_at < (
          SELECT blog_article.created_at FROM blog_article WHERE blog_article.id = $2
      ) AND (
        ${whereValues.length ? `${whereQueries}` : ''}
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

  return await pool.query(query, [authId, cursor, limit, ...whereValues]);
};

export const getArticles = async (
  authId: number | undefined,
  limit: number = 10,
  offset: number = 0,
  cursor: number | undefined,
  queries: ArticlesQueries,
) => {
  if (cursor) {
    return getArticlesByCursor(authId, limit, cursor, queries);
  }

  return getArticlesByPagination(authId, limit, offset, queries);
};

export default getArticles;
