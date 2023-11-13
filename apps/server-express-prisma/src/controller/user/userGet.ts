import { NextFunction, Response } from 'express';
import { Request } from 'express-jwt';
import { ResponseError, TokenPayload, responseFormat, userViewer } from 'validator';
import userGetPrisma from '../../utils/db/user/userGetPrisma';
const userGet = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.auth as TokenPayload;

  const originData = await userGetPrisma(auth.id);
  if (!originData) {
    next(new ResponseError(404, 'User not found!'));
    return;
  }

  return res.status(200).json(
    responseFormat({
      error: null,
      success: true,
      data: userViewer(originData),
    }),
  );
};

export default userGet;
