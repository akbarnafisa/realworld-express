import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { commentDeleteService } from '../../services/comments';

const articleDelete: RequestHandler = async (req, res, next) => {
  try {
    await commentDeleteService(req);
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
