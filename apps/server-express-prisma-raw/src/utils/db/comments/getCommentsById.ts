import pool from '../../../app/db';

const getCommentByPagination = async (articleId: number, limit: number, offset: number) => {
  const query = `
    SELECT
      bc.id,
      bc.body,
      bc.created_at AS "createdAt",
      bc.updated_at AS "updatedAt",
      bc.author_id AS "authorId",
      bc.article_id AS "articleId",
      jsonb_build_object(
          'username',
          blog_user.username,
          'image',
          blog_user.image
      ) as author
    from blog_comment AS bc
      JOIN blog_user ON blog_user.id = bc.author_id
    WHERE bc.article_id = $1
    ORDER BY
      bc.created_at DESC
    LIMIT $2
    OFFSET $3
  `;

  return await pool.query(query, [articleId, limit, offset]);
};

const getCommentByCursor = async (articleId: number, limit: number, cursor: number) => {
  const query = `
    SELECT
      bc.id,
      bc.body,
      bc.created_at AS "createdAt",
      bc.updated_at AS "updatedAt",
      bc.author_id AS "authorId",
      bc.article_id AS "articleId",
      jsonb_build_object(
          'username',
          blog_user.username,
          'image',
          blog_user.image
      ) as author
    from blog_comment AS bc
      JOIN blog_user ON blog_user.id = bc.author_id
    WHERE (
      bc.article_id = $1
      AND bc.created_at < (
          SELECT blog_comment.created_at FROM blog_comment WHERE blog_comment.id = $2
      )
    )
    ORDER BY
      bc.created_at DESC
    LIMIT $3
    OFFSET 0
  `;

  return await pool.query(query, [articleId, cursor, limit]);
};

export const getComments = async (articleId: number, limit: number = 10, offset: number = 0, cursor?: number) => {
  if (cursor) {
    return getCommentByCursor(articleId, limit, cursor);
  }

  return getCommentByPagination(articleId, limit, offset);
};

export default getComments;
