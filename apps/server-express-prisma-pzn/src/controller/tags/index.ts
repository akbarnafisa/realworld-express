import { RequestHandler } from 'express';
import { getTagssService } from '../../service/tags';

export const getTagsController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getTagssService(req);
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};
