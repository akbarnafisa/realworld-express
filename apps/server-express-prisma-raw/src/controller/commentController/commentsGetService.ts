import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { commentsGetService } from '../../services/comments';

const tagGet: RequestHandler = async (req, res, next) => {
  try {
    const data = await commentsGetService(req);
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

export default tagGet;
