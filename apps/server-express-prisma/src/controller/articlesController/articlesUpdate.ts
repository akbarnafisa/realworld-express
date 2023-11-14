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
import articleUpdatePrisma from '../../utils/db/article/articleUpdatePrisma';
import { checkArticle, checkArticleOwner } from '../../utils/articleChecker';

const articlesUpdate: RequestHandler = async (request, res, next) => {
  try {
    const auth = request?.auth as TokenPayload | undefined;

    if (!auth || !auth.id) {
      throw new ResponseError(401, 'User unauthenticated!');
    }

    const { slug } = request.params;

    const originArticle = await checkArticle(slug);
    checkArticleOwner(auth.id, originArticle.authorId);

    const data = await validate<ArticleCreateInputType>(articleInputSchema, request.body);

    const response = await articleUpdatePrisma(slug, data, auth, originArticle);

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

export default articlesUpdate;
