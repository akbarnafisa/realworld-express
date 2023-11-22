import { CommentInputType } from 'validator';
import pool from '../../../app/db';

const createArticle = async (data: CommentInputType, authorId: number, articleId: number) => {
  const payload = {
    body: data.body,
    author_id: authorId,
    article_id: articleId,
  };

  const columnQuery = Object.keys(payload).join(', ');
  const valuesQuery = Object.keys(payload)
    .map((_, index) => `$${index + 1}`)
    .join(', ');

  const query = `
      WITH inserted_comment AS (
        INSERT INTO
            blog_comment(${columnQuery})
        values(${valuesQuery})
        RETURNING *
      )
      SELECT
      ic.id,
      ic.body,
      ic.created_at AS "createdAt",
      ic.updated_at AS "updatedAt",
      ic.author_id AS "authorId",
      ic.article_id AS "articleId",
      jsonb_build_object(
          'username',
          blog_user.username,
          'image',
          blog_user.image
      ) as author
      FROM inserted_comment ic
      JOIN blog_user ON blog_user.id = ic.author_id
  `;

  return await pool.query(query, Object.values(payload));
};

export default createArticle;
