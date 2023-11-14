import type { RequestHandler } from 'express';
import { responseFormat, TokenPayload, ResponseError } from 'validator';
import articleFavoritePrisma from '../../utils/db/article/articleFavoritePrisma';
import { checkArticle } from '../../utils/articleChecker';

const articlesFavorite: RequestHandler = async (request, res, next) => {
  try {
    const auth = request?.auth as TokenPayload | undefined;
    const { slug } = request.params;

    if (!auth || !auth.id) {
      throw new ResponseError(401, 'User unauthenticated!');
    }
    await checkArticle(slug);

    await articleFavoritePrisma(slug, auth);


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

export default articlesFavorite;
