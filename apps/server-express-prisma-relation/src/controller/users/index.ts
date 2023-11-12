import type { RequestHandler } from 'express';
import { registerService, loginService } from '../../service/users';
import { responseFormat } from 'validator';

export const registerController: RequestHandler = async (req, res, next) => {
  try {
    const data = await registerService(req.body);
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

export const loginController: RequestHandler = async (req, res, next) => {
  try {
    const data = await loginService(req.body);
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
