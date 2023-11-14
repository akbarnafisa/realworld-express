import type { RequestHandler } from 'express';
import {
  responseFormat,
  TokenPayload,
  ResponseError,
} from 'validator';
import articleDeletePrisma from '../../utils/db/article/articleDeletePrisma';
import { checkArticle, checkArticleOwner } from '../../utils/articleChecker';

const articlesDelete: RequestHandler = async (request, res, next) => {
  try {
    const auth = request?.auth as TokenPayload | undefined;
    const { slug } = request.params;

    if (!auth || !auth.id) {
      throw new ResponseError(401, 'User unauthenticated!');
    }

    const originArticle = await checkArticle(slug);
    checkArticleOwner(auth.id, originArticle.authorId);

    await articleDeletePrisma(slug);

    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: null,
      }),
    );
  } catch (e) {
    next(e);
  }
};

export default articlesDelete;
