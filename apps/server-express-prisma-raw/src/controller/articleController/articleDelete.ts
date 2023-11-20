import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { deleteArticleService } from '../../services/articles';

const articleDelete: RequestHandler = async (req, res, next) => {
  try {
    await deleteArticleService(req);
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

export default articleDelete;
