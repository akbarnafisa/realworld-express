import pool from '../../../app/db';
import { TagModel } from '../../types';
import createTag from './createTag';
import { ArticleCreateInputType } from 'validator';

const removeArticleTagsRelation = async (articleId: number) => {
  const query = `DELETE FROM blog_articles_tags WHERE blog_articles_tags.article_id = $1`;
  const values = [articleId];

  return await pool.query(query, values);
};

const updateTag = async (tagList: ArticleCreateInputType['tagList'], articleId: number): Promise<TagModel[]> => {
  await removeArticleTagsRelation(articleId);
  return await createTag(tagList);
};

export default updateTag;
