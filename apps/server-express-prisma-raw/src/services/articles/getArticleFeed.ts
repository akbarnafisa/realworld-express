import type { Request } from 'express-jwt';
import { ArticleExtendInfo, ResponseError, TokenPayload, articlesViewer } from 'validator';
import { getFeed, getArticleFeedLength } from '../../utils/db/article';

const getArticleFeed = async (request: Request) => {
  const auth = request.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { limit, offset, cursor } = request.query;

  let skip, take, _cursor;

  if (cursor) {
    skip = 1;
    take = Number(limit);
    _cursor = Number(cursor);
  } else {
    skip = Number(offset) || undefined;
    take = Number(limit) || undefined;
  }

  const feedQuery = await getFeed(auth.id, take, skip, _cursor);
  const feedData = feedQuery?.rows as ArticleExtendInfo[];

  let hasMore;
  let nextCursor;
  let articlesCount;

  if (!cursor) {
    const feedCountQuery = await getArticleFeedLength(auth.id);
    articlesCount = feedCountQuery?.rows[0].total_comments as number;
  } else if (feedData.length > 0) {
    const lastLinkResults = feedData[feedData.length - 1];
    const myCursor = lastLinkResults.id;

    const secondQueryResultsQuery = await getFeed(auth.id, take, 0, myCursor);
    const secondQueryResults = secondQueryResultsQuery?.rows as ArticleExtendInfo[];

    (hasMore = secondQueryResults.length >= Number(take)), (nextCursor = hasMore ? myCursor : null);
  }

  return articlesViewer(feedData, {
    nextCursor,
    hasMore,
    articlesCount,
  });
};

export default getArticleFeed;
