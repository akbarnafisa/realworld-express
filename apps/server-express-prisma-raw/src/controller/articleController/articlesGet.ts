import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { getArticlesService } from '../../services/articles';

const articlesGet: RequestHandler = async (req, res, next) => {
  try {
    const data = await getArticlesService(req);
    res.status(200).send(
      responseFormat({
        data,
        error: null,
        success: true,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default articlesGet;
