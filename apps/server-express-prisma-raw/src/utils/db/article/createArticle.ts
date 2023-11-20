import { ArticleCreateInputType, TokenPayload } from 'validator';
import { slugify } from '../../formatArticle';
import pool from '../../../app/db';

const createArticle = async (data: ArticleCreateInputType, auth: TokenPayload) => {
  const payload = {
    body: data.body,
    description: data.description,
    title: data.title,
    slug: slugify(data.title),
    author_id: auth.id,
  };

  const columnQuery = Object.keys(payload).join(', ');
  const valuesQuery = Object.keys(payload)
    .map((_, index) => `$${index + 1}`)
    .join(', ');

  const query = `INSERT INTO blog_article(${columnQuery}) values(${valuesQuery}) RETURNING *`;

  return await pool.query(query, Object.values(payload));
};

export default createArticle;
