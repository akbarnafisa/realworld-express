import type { RequestHandler } from 'express';
import {
  responseFormat,
  TokenPayload,
  ResponseError,
  articleViewer,
} from 'validator';
import articleGetPrisma from '../../utils/db/article/articleGetPrisma';

const articlesGet: RequestHandler = async (request, res, next) => {
  try {
    const auth = request?.auth as TokenPayload | undefined;

    const { slug } = request.params;

    const response = await articleGetPrisma(slug, auth);

    if (!response) {
      throw new ResponseError(404, 'Article not found!');
    }

    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: articleViewer(response),
      }),
    );
  } catch (e) {
    next(e);
  }
};

export default articlesGet;
