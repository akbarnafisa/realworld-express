import { RequestHandler } from 'express';
import { getTagsService } from '../../service/tags';

export const getTagsController: RequestHandler = async (_, res, next) => {
  try {
    const data = await getTagsService();
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};
