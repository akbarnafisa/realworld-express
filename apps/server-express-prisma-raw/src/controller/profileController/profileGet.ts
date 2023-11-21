import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { getProfileService } from '../../services/profile';

const articleFavorite: RequestHandler = async (req, res, next) => {
  try {
    const data = await getProfileService(req);
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

export default articleFavorite;
