import { RequestHandler } from 'express';
import { getTagsService } from '../../service/tags';
import { responseFormat } from 'validator';

export const getTagsController: RequestHandler = async (_, res, next) => {
  try {
    const data = await getTagsService();
    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data,
      }),
    );
  } catch (error) {
    next(error);
  }
};
