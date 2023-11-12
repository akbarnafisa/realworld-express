import type { RequestHandler } from 'express';
import { getCurrentUserService, updateUserService } from '../../service/user';
import { responseFormat } from 'validator';

export const getUserController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getCurrentUserService(req);
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

export const updateUserController: RequestHandler = async (req, res, next) => {
  try {
    const data = await updateUserService(req);
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
