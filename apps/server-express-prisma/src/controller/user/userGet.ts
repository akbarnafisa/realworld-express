import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { ResponseError, TokenPayload, userViewer } from 'validator';
import userGetPrisma from '../../utils/db/user/userGetPrisma';
const userGet = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    next(new ResponseError(401, 'User unauthenticated!'));
    return;
  }

  const originData = await userGetPrisma(auth.id);
  if (!originData) {
    next(new ResponseError(404, 'User not found!'));
    return;
  }

  return res.status(200).json({
    data: userViewer(originData),
  });
};

export default userGet;
