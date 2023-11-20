import pool from '../../../app/db';

const deleteArticleById = async (id: number) => {
  const query = `DELETE FROM blog_article WHERE blog_article.id = $1`;

  return await pool.query(query, [id]);
};

export default deleteArticleById;
