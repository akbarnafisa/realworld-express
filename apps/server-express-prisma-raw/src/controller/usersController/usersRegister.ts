import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { registerService } from '../../services/users';

const usersRegister: RequestHandler = async (req, res, next) => {
  try {
    const data = await registerService(req);
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

export default usersRegister;
