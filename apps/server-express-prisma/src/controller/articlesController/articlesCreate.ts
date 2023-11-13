import type { RequestHandler } from 'express';
import {
  validate,
  ArticleCreateInputType,
  articleInputSchema,
  responseFormat,
  TokenPayload,
  ResponseError,
  articleViewer,
} from 'validator';
import articleCreatePrisma from '../../utils/db/article/articleCreatePrisma';

const articlesCreate: RequestHandler = async (request, res, next) => {
  try {
    const auth = request?.auth as TokenPayload | undefined;

    if (!auth || !auth.id) {
      throw new ResponseError(401, 'User unauthenticated!');
    }

    const data = await validate<ArticleCreateInputType>(articleInputSchema, request.body);

    const response = await articleCreatePrisma(data, auth);

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

export default articlesCreate;
