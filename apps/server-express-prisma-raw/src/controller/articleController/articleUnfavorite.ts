import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { unFavoriteArticleService } from '../../services/articles';

const articleUnfavorite: RequestHandler = async (req, res, next) => {
  try {
    await unFavoriteArticleService(req);
    res.status(200).send(
      responseFormat({
        data: null,
        error: null,
        success: true,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default articleUnfavorite;
