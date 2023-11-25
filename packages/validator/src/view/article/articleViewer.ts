import { Article } from '@prisma/client';
import type { ArticleResponseType, ArticlesResponseType } from './type';

export type ArticleExtendInfo = Article & {
  _count: {
    favoritedBy: number;
  };
  favoritedBy: {
    userId: number;
  }[];
  tags: {
    tag: {
      name: string;
    };
  }[];
  author: {
    username: string;
    image: string | null;
    followedBy: {
      followerId: number;
    }[];
  };
};

export const articleViewer = (article: ArticleExtendInfo): ArticleResponseType => {
  const favoritesCount = article?._count?.favoritedBy || 0;
  const tags = article.tags.map((data) => data.tag.name);
  const favorited = article.favoritedBy ? article.favoritedBy.filter((data) => data.userId !== null).length > 0 : false;
  const author = {
    username: article.author.username,
    image: article.author.image,
    following: article.author.followedBy
      ? article.author.followedBy.filter((data) => data.followerId !== null).length > 0
      : false,
  };

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
      author,
    },
  };
};

export const articlesViewer = (
  articles: ArticleExtendInfo[],
  opt?: {
    articlesCount?: number;
    nextCursor?: number | null;
    hasMore?: boolean;
  },
): ArticlesResponseType => {
  const articlesData = articles.map((article) => articleViewer(article).article);

  return {
    articles: articlesData,
    articlesCount: opt?.articlesCount ? Number(opt.articlesCount) : opt?.articlesCount,
    nextCursor: opt?.nextCursor,
    hasMore: opt?.hasMore,
  };
};
