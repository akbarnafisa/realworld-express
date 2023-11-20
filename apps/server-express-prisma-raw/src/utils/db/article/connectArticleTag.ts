import pool from '../../../app/db';
import { TagModel } from '../../types';

export const connectArticleTag = async (tagList: TagModel[], articleId: number) => {
  const values = tagList.map((_, i) => `($1, $${i + 2})`).join(', ');
  const query = `INSERT INTO blog_articles_tags (article_id, tag_id) VALUES ${values} RETURNING blog_articles_tags.article_id, blog_articles_tags.tag_id`;

  return await pool.query(query, [articleId, ...tagList.map((tag) => tag.id)]);
};

export default connectArticleTag;
