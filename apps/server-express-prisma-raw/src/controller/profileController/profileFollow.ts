import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { followProfileService } from '../../services/profile';

const articleFavorite: RequestHandler = async (req, res, next) => {
  try {
    await followProfileService(req);
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

export default articleFavorite;
