import { ArticleCreateInputType } from 'validator';
import pool from '../../../app/db';
import { slugify } from '../../formatArticle';

const updateArticle = async (data: Partial<ArticleCreateInputType>, slug: string) => {
  const payload = {
    body: data.body,
    description: data.description,
    title: data.title,
    slug: data.title ? slugify(data.title) : undefined,
  };

  const inputData = Object.keys(payload)
    .map((key, index) => {
      const keyData = key as keyof typeof payload;
      return payload[keyData] ? `${key} = $${index + 2}` : null;
    })
    .filter(Boolean)
    .join(', ');

  const query = `UPDATE blog_article SET ${inputData} WHERE (slug = $1) RETURNING *`;
  const values = [slug, ...Object.values(payload).filter(Boolean)];

  console.log({
    query,
    values
  })

  return await pool.query(query, values);
};

export default updateArticle;
