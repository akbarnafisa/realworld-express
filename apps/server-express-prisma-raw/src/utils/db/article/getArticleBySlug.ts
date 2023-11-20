import pool from '../../../app/db';

export const getArticleBySlug = async (slug: string) => {
  return await pool.query('SELECT * from blog_article WHERE (slug = $1 AND 1=1) LIMIT 1 OFFSET 0', [slug]);
};

export default getArticleBySlug;
