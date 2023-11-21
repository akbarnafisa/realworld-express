import pool from '../../../app/db';

const unFavoriteArticle = async (articleId: number, authorId: number) => {
  const query = `DELETE FROM blog_favorites WHERE blog_favorites.article_id = $1 AND blog_favorites.author_id = $2`;

  return await pool.query(query, [articleId, authorId]);
};

export default unFavoriteArticle;
