import { RequestHandler } from 'express';
import { getCurrentUserService } from '../../services/user';
import { responseFormat } from 'validator';

const userGet: RequestHandler = async (req, res, next) => {
  try {
    const data = await getCurrentUserService(req);
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

export default userGet;
