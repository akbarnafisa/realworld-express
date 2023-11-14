
import type { RequestHandler } from 'express';
import { ResponseError, TokenPayload, articlesViewer, responseFormat } from 'validator';
import articleFeedPrisma from '../../utils/db/article/articleFeedPrisma';

const articlesFeed: RequestHandler = async (request, res, next) => {
  try {
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

    const { data, articlesCount, hasMore, nextCursor } = await articleFeedPrisma({
      cursor: Number(cursor),
      skip,
      take,
      auth,
    });

    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: articlesViewer(data, {
          nextCursor,
          hasMore,
          articlesCount,
        }),
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default articlesFeed;
