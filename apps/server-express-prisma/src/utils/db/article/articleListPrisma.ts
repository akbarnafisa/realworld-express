import { TokenPayload } from 'validator';
import { articleIncludes, articlesQueryFilter } from '../../articleChecker';
import prisma from '../prisma';
const DEFAULT_ARTICLES_QUERIES = 10;

export default async function articleListPrisma({
  skip,
  take,
  cursor,
  auth,
  tag,
  author,
  favorited,
}: {
  skip?: number;
  take?: number;
  cursor?: number;
  auth?: TokenPayload;
  tag?: string;
  author?: string;
  favorited?: string;
}) {
  const data = await prisma.article.findMany({
    skip: skip || 0,
    take: take || DEFAULT_ARTICLES_QUERIES,
    cursor: cursor ? { id: Number(cursor) } : undefined,
    orderBy: {
      createdAt: 'desc',
    },
    where: articlesQueryFilter({ tag, author, favorited }),
    include: articleIncludes(auth),
  });

  let articlesCount;
  let hasMore;
  let nextCursor;

  if (!cursor) {
    articlesCount = (
      await prisma.article.findMany({
        where: articlesQueryFilter({ tag, author, favorited }),
      })
    ).length;
  } else if (data.length > 0) {
    const lastLinkResults = data[data.length - 1];
    const myCursor = lastLinkResults.id;

    const secondQueryResults = await prisma.article.findMany({
      take: take || DEFAULT_ARTICLES_QUERIES,
      cursor: {
        id: myCursor,
      },
    });
    (hasMore = secondQueryResults.length >= Number(take)), (nextCursor = hasMore ? myCursor : null);
  }

  return {
    data: data.map((res) => ({
      ...res,
      author: {
        ...res.author,
        followedBy: res.author.followedBy?.map((data) => ({
          followerId: data.id,
        })),
      },
      tags: res.tags?.map((data) => ({
        tag: data,
      })),
      favoritedBy: res.favoritedBy?.map((data) => ({
        userId: data.id,
      })),
    })),
    nextCursor,
    hasMore,
    articlesCount,
  };
}
