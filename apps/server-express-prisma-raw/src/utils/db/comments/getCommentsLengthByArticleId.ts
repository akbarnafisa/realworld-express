import pool from "../../../app/db";

const getArticleLengthBySlug = async (articleId: number) => {
  const query = `
    SELECT
        COUNT(*) AS total_comments
    FROM
      blog_comment
    WHERE
      blog_comment.article_id = $1
  `;

  return await pool.query(query, [articleId]);
};

export default getArticleLengthBySlug