import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { unFollowProfileService } from '../../services/profile';

const articleFavorite: RequestHandler = async (req, res, next) => {
  try {
    await unFollowProfileService(req);
    res.status(200).send(
      responseFormat({
        data: {
          success: true
        },
        error: null,
        success: true,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default articleFavorite;
