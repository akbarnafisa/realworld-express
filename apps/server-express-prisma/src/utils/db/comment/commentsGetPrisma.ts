import prisma from '../prisma';
const DEFAULT_COMMENTS_QUERIES = 10;

export default async function commentsGetPrisma({
  skip,
  take,
  cursor,
  articleId,
}: {
  skip?: number;
  take?: number;
  cursor?: number;
  articleId: number;
}) {
  const data = await prisma.comment.findMany({
    where: {
      articleId: articleId,
    },
    skip: skip || 0,
    take: take || DEFAULT_COMMENTS_QUERIES,
    cursor: cursor ? { id: Number(cursor) } : undefined,
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      author: {
        select: {
          username: true,
          image: true,
        },
      },
    },
  });

  let hasMore;
  let nextCursor;
  let commentsCount;

  if (!cursor) {
    commentsCount = (
      await prisma.comment.findMany({
        where: {
          articleId: articleId,
        },
      })
    ).length;
  } else if (data.length > 0) {
    const lastLinkResults = data[data.length - 1];
    const myCursor = lastLinkResults.id;

    const secondQueryResults = await prisma.comment.findMany({
      take: take || DEFAULT_COMMENTS_QUERIES,
      cursor: {
        id: myCursor,
      },
    });
    (hasMore = secondQueryResults.length >= Number(take)), (nextCursor = hasMore ? myCursor : null);
  }

  return {
    data,
    nextCursor,
    hasMore,
    commentsCount,
  };
}
