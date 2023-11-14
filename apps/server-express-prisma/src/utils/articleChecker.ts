import { ResponseError, TokenPayload } from 'validator';
import prisma from './db/prisma';

export const checkArticle = async (slug: string) => {
  const data = await prisma.article.findUnique({
    where: {
      slug,
    },
  });

  if (!data) {
    throw new ResponseError(404, 'Article not found!');
  }

  return data;
};

export const articleIncludes = (auth: TokenPayload | undefined) => {
  return {
    author: {
      select: {
        username: true,
        image: true,
        followedBy: {
          select: {
            id: true,
          },
          where: {
            id: auth?.id,
          },
        },
      },
    },
    favoritedBy: auth?.id
      ? {
          select: {
            id: true,
          },
          where: {
            id: auth?.id,
          },
        }
      : undefined,
    tags: true,
    _count: { select: { favoritedBy: true } },
  };
};

export const checkArticleOwner = (currentUserId: number, authorId: number) => {
  if (currentUserId !== authorId) {
    throw new ResponseError(401, 'User unauthorized!');
  }
};
