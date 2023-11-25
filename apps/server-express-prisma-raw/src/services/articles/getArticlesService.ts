import type { Request } from 'express-jwt';
import { ArticleExtendInfo, TokenPayload, articlesViewer } from 'validator';
import { getArticles, getArticlesLength } from '../../utils/db/article';

const getArticlesService = async (request: Request) => {
  const auth = request.auth as TokenPayload | undefined;

  const { limit, offset, cursor, tag, author, favorited } = request.query;

  let skip, take, _cursor;

  if (cursor) {
    skip = 1;
    take = Number(limit);
    _cursor = Number(cursor);
  } else {
    skip = Number(offset) || undefined;
    take = Number(limit) || undefined;
  }

  const feedQuery = await getArticles(auth?.id, take, skip, _cursor, {
    author: author ? String(author) : undefined,
    favorited: favorited ? String(favorited) : undefined,
    tag: tag ? String(tag) : undefined,
  });
  const feedData = feedQuery?.rows as ArticleExtendInfo[];

  let hasMore;
  let nextCursor;
  let articlesCount;

  if (!cursor) {
    const articleCountQuery = await getArticlesLength({
      author: author ? String(author) : undefined,
      favorited: favorited ? String(favorited) : undefined,
      tag: tag ? String(tag) : undefined,
    });
    articlesCount = articleCountQuery?.rows[0].total_articles as number;
  } else if (feedData.length > 0) {
    const lastLinkResults = feedData[feedData.length - 1];
    const myCursor = lastLinkResults.id;

    const secondQueryResultsQuery = await getArticles(auth?.id, take, 0, myCursor, {
      author: author ? String(author) : undefined,
      favorited: favorited ? String(favorited) : undefined,
      tag: tag ? String(tag) : undefined,
    });
    const secondQueryResults = secondQueryResultsQuery?.rows as ArticleExtendInfo[];

    (hasMore = secondQueryResults.length >= Number(take)), (nextCursor = hasMore ? myCursor : null);
  }

  return articlesViewer(feedData, {
    nextCursor,
    hasMore,
    articlesCount,
  });
};

export default getArticlesService;
