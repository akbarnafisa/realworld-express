import type { RequestHandler } from 'express';
import { getCurrentUserService, updateUserService } from '../../service/user';

export const getUserController: RequestHandler = async (req, res, next) => {
  try {
    const result = await getCurrentUserService(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const updateUserController: RequestHandler = async (req, res, next) => {
  try {
    const result = await updateUserService(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
