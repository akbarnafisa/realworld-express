import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { getTagsService } from '../../services/tags';

const tagGet: RequestHandler = async (req, res, next) => {
  try {
    const data = await getTagsService();
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
