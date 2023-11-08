import { Article } from '@prisma/client';
import type { ArticleResponseType, ArticlesResponseType } from './type';

type ArticleExtendInfo = Article & {
  _count?: {
    favoritedBy: number;
  };
  favoritedBy?: {
    userId: number;
  }[];
  tags?: {
    tag: {
      name: string;
    };
  }[];
  author?: {
    username: string;
    image: string | null;
    following: any[];
  };
};

export const articleViewer = (article: ArticleExtendInfo): ArticleResponseType => {
  const favoritesCount = article?._count?.favoritedBy;
  const tags = article.tags?.map((data) => data.tag.name);
  const favorited = article.favoritedBy?.some((data) => data.userId === article.authorId);

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
      favorited: favorited || false,
      tags,
      author: article.author,
    },
  };
};

export const articlesViewer = (
  articles: ArticleExtendInfo[],
  opt?: {
    articlesCount?: number;
  },
): ArticlesResponseType => {
  const articlesData = articles.map((article) => articleViewer(article).article);

  return {
    articles: articlesData,
    articlesCount: opt?.articlesCount,
  };
};
