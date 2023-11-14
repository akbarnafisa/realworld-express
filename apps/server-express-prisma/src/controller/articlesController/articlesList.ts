import type { RequestHandler } from 'express';
import { TokenPayload, articlesViewer, responseFormat } from 'validator';
import articleListPrisma from '../../utils/db/article/articleListPrisma';

const articlesList: RequestHandler = async (request, res, next) => {
  try {
    const auth = request?.auth as TokenPayload | undefined;
    const { limit, offset, cursor, author, tag, favorited } = request.query;

    let skip, take;

    if (cursor) {
      skip = 1;
      take = Number(limit);
    } else {
      skip = Number(offset) || undefined;
      take = Number(limit) || undefined;
    }

    const { data, articlesCount, hasMore, nextCursor } = await articleListPrisma({
      cursor: Number(cursor),
      skip,
      take,
      auth,
      author: author && String(author),
      tag: tag && String(tag),
      favorited: favorited && String(favorited),
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

export default articlesList;
