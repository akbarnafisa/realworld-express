import { ResponseError, TokenPayload } from 'validator';
import prisma from './db/prisma';
import { Prisma } from '@prisma/client';

export const checkArticle = async (slug: string) => {
  const data = await prisma.article.findUnique({
    where: {
      slug,
    },
    include: {
      tags: true,
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

export const articlesQueryFilter = ({
  tag,
  author,
  favorited,
}: {
  tag?: string;
  author?: string;
  favorited?: string;
}) => {
  return Prisma.validator<Prisma.ArticleWhereInput>()({
    AND: [
      // { del: false },
      { author: author ? { username: author } : undefined },
      { tags: tag ? { some: { name: tag } } : undefined },
      {
        favoritedBy: favorited
          ? {
              // this "some" operator somehow could not work with the nested undefined value in an "AND" array
              some: {
                // favoritedBy: { username: favorited },
                username: favorited,
              },
            }
          : undefined,
      },
    ],
  });
};
