import type { RequestHandler } from 'express';
import { responseFormat } from 'validator';
import { loginService } from '../../services/users';

const usersLogin: RequestHandler = async (req, res, next) => {
  try {
    const data = await loginService(req);
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

export default usersLogin;
