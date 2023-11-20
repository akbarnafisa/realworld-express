import slug from 'slug';
import { getArticleBySlug } from './db/article';
import { ArticleModel } from './types';
import { ResponseError } from 'validator';

export const slugify = (title: string): string => {
  return `${slug(title, { lower: true })}-${((Math.random() * Math.pow(36, 6)) | 0).toString(36)}`;
};

export const checkArticle = async (slug: string) => {
  const data = await getArticleBySlug(slug);
  const result = data?.rows[0] as ArticleModel;

  if (!result) {
    throw new ResponseError(404, 'Article not found!');
  }

  return result;
};

export const checkArticleOwner = (currentUserId: number, authorId: number) => {
  if (currentUserId !== authorId) {
    throw new ResponseError(401, 'User unauthorized!');
  }
};
