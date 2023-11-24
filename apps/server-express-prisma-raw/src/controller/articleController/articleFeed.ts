import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { getArticleFeed } from '../../services/articles';

const articleGet: RequestHandler = async (req, res, next) => {
  try {
    const data = await getArticleFeed(req);
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

export default articleGet;
