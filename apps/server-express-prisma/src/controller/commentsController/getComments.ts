import type { RequestHandler } from 'express';
import {  commentsViewer, responseFormat } from 'validator';
import { checkArticle } from '../../utils/articleChecker';
import commentsGetPrisma from '../../utils/db/comment/commentsGetPrisma';

const getComments: RequestHandler = async (request, res, next) => {
  try {
    const { slug } = request.params;
    const { limit, offset, cursor } = request.query;

    const article = await checkArticle(slug);
    let skip, take;

    if (cursor) {
      skip = 1;
      take = Number(limit);
    } else {
      skip = Number(offset) || undefined;
      take = Number(limit) || undefined;
    }

    const { data, commentsCount, hasMore, nextCursor } = await commentsGetPrisma({
      articleId: article.id,
      cursor: Number(cursor),
      skip,
      take,
    });

    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: commentsViewer(data, {
          nextCursor,
          hasMore,
          commentsCount,
        }),
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default getComments;
