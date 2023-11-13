import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import {
  ResponseError,
  TokenPayload,
  UserUpdateInputType,
  responseFormat,
  userUpdateInputSchema,
  userViewer,
  validate,
} from 'validator';
import userUpdatePrisma from '../../utils/db/user/userUpdatePrisma';
import userGetPrisma from '../../utils/db/user/userGetPrisma';
import { hashPassword } from '../../utils/hashPassword';

const userUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.auth as TokenPayload;

    const { password, ...restInput } = await validate<UserUpdateInputType>(userUpdateInputSchema, req.body);

    const originData = await userGetPrisma(auth.id);
    if (!originData) {
      next(new ResponseError(404, 'User not found'));
      return;
    }

    const payload = {
      ...restInput,
      password: password ? hashPassword(password) : undefined,
    };

    const updatedUser = await userUpdatePrisma(payload, originData.id);

    return res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: userViewer(updatedUser),
      }),
    );
  } catch (error) {
    next(error)
  }
};

export default userUpdate;
