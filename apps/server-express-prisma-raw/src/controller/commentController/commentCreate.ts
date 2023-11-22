import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { commentCreateService } from '../../services/comments';

const articleCreate: RequestHandler = async (req, res, next) => {
  try {
    const data = await commentCreateService(req);
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
