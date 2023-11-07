import { Article } from '@prisma/client';
import type { ArticleResponseType } from './type';

type ArticleExtendInfo = Article & {
  _count?: {
    favoritedBy: number;
  };
  favorited?: boolean;
  tags?: {
    tag: {
      name: string;
    };
  }[];
};

export const articleViewer = (article: ArticleExtendInfo): ArticleResponseType => {
  const favoritesCount = article?._count?.favoritedBy;
  const tags = article.tags?.map((data) => data.tag.name)
  return {
    article: {
      body: article.body,
      createdAt: article.createdAt,
      description: article.description,
      id: article.id,
      slug: article.slug,
      title: article.title,
      updatedAt: article.updatedAt,
      authorId: article.authorId,
      favoritesCount,
      favorited: article.favorited || false,
      tags,
    },
  };
};
