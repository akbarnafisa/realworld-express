import { Article } from '@prisma/client';
import type { ArticleResponseType } from './type';

export const userViewer = (article: Article): ArticleResponseType => {
  return  {
    article: {
      body: article.body,
      createdAt: article.createdAt,
      description: article.description,
      id: article.id,
      slug: article.slug,
      title: article.title,
      updateAt: article.updateAt,
      authorId: article.authorId,
    },
  };;
};
