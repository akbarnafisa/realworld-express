import { ArticleCreateInputType } from 'validator';
import pool from '../../../app/db';
import { slugify } from '../../formatArticle';

const updateArticle = async (data: Partial<ArticleCreateInputType>, slug: string) => {
  const payload = {
    body: data.body,
    description: data.description,
    title: data.title,
    slug: data.title ? slugify(data.title) : undefined,
    updated_at: new Date(),
  };

  const filteredValues = Object.values(payload).filter(Boolean);

  const inputData = Object.keys(payload)
    .filter((key) => {
      const keyData = key as keyof typeof payload;
      return payload[keyData];
    })
    .map((key, index) => {
      return `${key} = $${index + 2}`;
    })
    .join(', ');

  const query = `UPDATE blog_article SET ${inputData} WHERE (slug = $1) RETURNING *`;
  const values = [slug, ...filteredValues];

  return await pool.query(query, values);
};

export default updateArticle;
