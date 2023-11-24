import type { Request } from 'express-jwt';
import { CommentType, commentsViewer } from 'validator';
import { getCommentsLengthByArticleId, getCommentsById } from '../../utils/db/comments';
import { checkArticle } from '../../utils/formatArticle';

const commentsGetService = async (request: Request) => {
  const { slug } = request.params;
  const { limit, offset, cursor } = request.query;

  const article = await checkArticle(slug);

  let skip, take, _cursor;

  if (cursor) {
    skip = 1;
    take = Number(limit);
    _cursor =  Number(cursor)
  } else {
    skip = Number(offset) || undefined;
    take = Number(limit) || undefined;
  }

  const commentsQuery = await getCommentsById(article.id, take, skip, _cursor);
  const commetsData = commentsQuery?.rows as CommentType[];

  let hasMore;
  let nextCursor;
  let commentsCount;

  if (!cursor) {
    const commentsCountQuery = await getCommentsLengthByArticleId(article.id);
    commentsCount = commentsCountQuery?.rows[0].total_comments as number;
  } else if (commetsData.length > 0) {
    const lastLinkResults = commetsData[commetsData.length - 1];
    const myCursor = lastLinkResults.id;

    const secondQueryResultsQuery = await getCommentsById(article.id, take, 0, myCursor);
    const secondQueryResults = secondQueryResultsQuery?.rows as CommentType[];
  
    (hasMore = secondQueryResults.length >= Number(take)), (nextCursor = hasMore ? myCursor : null);
  }

  return commentsViewer(commetsData, {
    nextCursor,
    hasMore,
    commentsCount,
  });
};

export default commentsGetService;
