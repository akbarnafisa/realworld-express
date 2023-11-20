import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { createArticle } from '../../services/articles';

const articleCreate: RequestHandler = async (req, res, next) => {
  try {
    const data = await createArticle(req);
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

export default articleCreate;
