import { RequestHandler } from 'express';
import { updateUserService } from '../../services/user';
import { responseFormat } from 'validator';

const userUpdate: RequestHandler = async (req, res, next) => {
  try {
    const data = await updateUserService(req);
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

export default userUpdate;
