import pool from '../../../app/db';
import { TagModel } from '../../types';
import getTag from './getTag';
import { ArticleCreateInputType } from 'validator';

const addTag = async (tagName: string) => {
  const query = `INSERT INTO blog_tag (name) VALUES ($1) RETURNING blog_tag.id, blog_tag.name`;
  const values = [tagName];

  return await pool.query(query, values);
};

const createTag = async (tagList: ArticleCreateInputType['tagList']): Promise<TagModel[]> => {
  const tags = Array.from(new Set(tagList));
  const tagIds = await Promise.all(
    tags.map(async (name) => {
      const tagQueryResult = await getTag(name);
      const tag = tagQueryResult?.rows[0];

      if (tag === undefined) {
        const data = await addTag(name);
        return data.rows[0];
      }

      return tag;
    }),
  );

  return tagIds;
};

export default createTag;
