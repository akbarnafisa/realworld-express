import pool from '../../../app/db';

export const favoriteArticle = async (articleId: number, authorId: number) => {
  const values = [articleId, authorId];
  return await pool.query('INSERT INTO blog_favorites(article_id, author_id) values($1, $2) RETURNING *', values);
};

export default favoriteArticle;
