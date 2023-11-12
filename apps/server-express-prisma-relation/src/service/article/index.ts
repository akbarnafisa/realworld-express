import { Request } from 'express-jwt';
import {
  ResponseError,
  TokenPayload,
  validate,
  ArticleCreateInputType,
  articleInputSchema,
  articleViewer,
  articlesViewer,
} from 'validator';
import { prismaClient } from '../../application/database';
import slug from 'slug';
import { Prisma } from '@prisma/client';

const slugify = (title: string): string => {
  return `${slug(title, { lower: true })}-${((Math.random() * Math.pow(36, 6)) | 0).toString(36)}`;
};

const DEFAULT_ARTICLES_QUERIES = 10;

export const createArticleService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { body, description, title, tagList } = await validate<ArticleCreateInputType>(
    articleInputSchema,
    request.body,
  );

  const data = await prismaClient.article.create({
    data: {
      body,
      description,
      title,
      slug: slugify(title),
      author: { connect: { id: auth.id } },
      tags: {
        create: tagList.map((name: string) => {
          return {
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          };
        }),
      },
    },
    include: articleIncludes(auth),
  });

  return articleViewer(data);
};

export const getArticleService = async (request: Request) => {
  const { slug } = request.params;
  const auth = request?.auth as TokenPayload | undefined;

  const data = await prismaClient.article.findUnique({
    where: {
      slug,
    },
    include: articleIncludes(auth),
  });

  if (!data) {
    throw new ResponseError(404, 'Article not found!');
  }

  return articleViewer(data);
};

export const getArticlesService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;
  const { limit, offset, cursor, ...restQuery } = request.query;

  let skip, take;

  if (cursor) {
    skip = 1;
    take = Number(limit);
  } else {
    skip = Number(offset) || undefined;
    take = Number(limit) || undefined;
  }

  const data = await prismaClient.article.findMany({
    skip: skip || 0,
    take: take || DEFAULT_ARTICLES_QUERIES,
    where: articlesQueryFilter(restQuery),
    include: articleIncludes(auth),
    orderBy: {
      createdAt: 'desc',
    },
  });

  let articlesCount;
  let hasMore;
  let nextCursor;

  if (!cursor) {
    articlesCount = (
      await prismaClient.article.findMany({
        where: articlesQueryFilter(restQuery),
      })
    ).length;
  } else {
    if (data.length > 0) {
      const lastLinkResults = data[data.length - 1];
      const myCursor = lastLinkResults.id;

      const secondQueryResults = await prismaClient.article.findMany({
        take: take || DEFAULT_ARTICLES_QUERIES,
        cursor: {
          id: myCursor,
        },
      });
      (hasMore = secondQueryResults.length >= Number(take)), (nextCursor = hasMore ? myCursor : null);
    }
  }

  return articlesViewer(data, {
    articlesCount,
    hasMore,
    nextCursor,
  });
};

export const getFeedService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { limit, offset, cursor } = request.query;

  let skip, take;

  if (cursor) {
    skip = 1;
    take = Number(limit);
  } else {
    skip = Number(offset) || undefined;
    take = Number(limit) || undefined;
  }

  const data = await prismaClient.article.findMany({
    skip: skip || 0,
    take: take || DEFAULT_ARTICLES_QUERIES,
    where: {
      author: {
        followedBy: {
          some: {
            followerId: auth.id,
          },
        },
      },
    },
    include: articleIncludes(auth),
    orderBy: {
      createdAt: 'desc',
    },
  });

  let articlesCount;
  let hasMore;
  let nextCursor;

  if (!cursor) {
    articlesCount = (
      await prismaClient.article.findMany({
        where: {
          author: {
            followedBy: {
              some: {
                followerId: auth.id,
              },
            },
          },
        },
      })
    ).length;
  } else {
    if (data.length > 0) {
      const lastLinkResults = data[data.length - 1];
      const myCursor = lastLinkResults.id;

      const secondQueryResults = await prismaClient.article.findMany({
        take: take || DEFAULT_ARTICLES_QUERIES,
        cursor: {
          id: myCursor,
        },
      });
      (hasMore = secondQueryResults.length >= Number(take)), (nextCursor = hasMore ? myCursor : null);
    }
  }

  return articlesViewer(data, {
    articlesCount,
    hasMore,
    nextCursor,
  });
};

export const deleteArticleService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = request.params;

  const originArticle = await checkArticle(slug);
  checkArticleOwner(auth.id, originArticle.authorId);

  await prismaClient.article.delete({
    where: {
      slug,
    },
  });
};

export const updateArticleService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = request.params;

  const originArticle = await checkArticle(slug);
  checkArticleOwner(auth.id, originArticle.authorId);

  const { body, description, title } = await validate<ArticleCreateInputType>(articleInputSchema, request.body);
  const isTitleChanged = title !== originArticle.title;
  const data = await prismaClient.article.update({
    where: {
      slug,
    },
    data: {
      title: isTitleChanged ? title : undefined,
      slug: isTitleChanged ? slugify(title) : undefined,
      body,
      description,
    },
    include: articleIncludes(auth),
  });

  return articleViewer(data);
};

export const favoriteArticleService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = request.params;

  await checkArticle(slug);

  try {
    await prismaClient.article.update({
      where: {
        slug,
      },
      data: {
        favoritedBy: {
          create: {
            userId: auth.id,
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new ResponseError(422, 'Article had been favorited!');
      }
    }
    throw new Error(e as string);
  }
};

export const unFavoriteArticleService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = request.params;
  const originArticle = await checkArticle(slug);

  try {
    await prismaClient.article.update({
      where: {
        slug,
      },
      data: {
        favoritedBy: {
          delete: {
            userId_articleId: {
              userId: auth.id,
              articleId: originArticle.id,
            },
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2017') {
        throw new ResponseError(422, 'Article had been unfavorited!');
      }
    }
  }
};

export const checkArticle = async (slug: string) => {
  const data = await prismaClient.article.findUnique({
    where: {
      slug,
    },
  });

  if (!data) {
    throw new ResponseError(404, 'Article not found!');
  }

  return data;
};

const articleIncludes = (auth: TokenPayload | undefined) => {
  return {
    author: {
      select: {
        followedBy: auth?.id
          ? {
              select: {
                followerId: true,
              },
              where: {
                followerId: auth.id,
              },
            }
          : undefined,
        username: true,
        image: true,
      },
    },
    favoritedBy: auth?.id
      ? {
          select: {
            userId: true,
          },
          where: {
            userId: auth.id,
          },
        }
      : undefined,
    tags: {
      select: {
        tag: {
          select: {
            name: true,
          },
        },
      },
    },
    _count: {
      select: {
        favoritedBy: true,
      },
    },
  };
};

const checkArticleOwner = (currentUserId: number, authorId: number) => {
  if (currentUserId !== authorId) {
    throw new ResponseError(401, 'User unauthorized!');
  }
};

const articlesQueryFilter = ({ tag, author, favorited }: { tag?: string; author?: string; favorited?: string }) => {
  return Prisma.validator<Prisma.ArticleWhereInput>()({
    AND: [
      // { del: false },
      { author: author ? { username: author } : undefined },
      { tags: tag ? { some: { tag: { name: tag } } } : undefined },
      {
        favoritedBy: favorited
          ? {
              // this "some" operator somehow could not work with the nested undefined value in an "AND" array
              some: {
                // favoritedBy: { username: favorited },
                user: {
                  username: favorited,
                },
              },
            }
          : undefined,
      },
    ],
  });
};
