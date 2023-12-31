/* eslint-disable @typescript-eslint/no-namespace */
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { ResponseError, TokenPayload } from 'validator';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      auth?: TokenPayload;
    }
  }
}

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET missing in environment.');
}

const verifyToken = (token: string) => {
  return jwt.verify(token, secret, {
    algorithms: ['HS256'],
  });
};

export const authenticator = (req: Request, _: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith('Bearer ')) {
    next(new ResponseError(401, 'No authorization token was found'));
    return;
  }

  const token = auth.split('Bearer ')[1];

  const payload = verifyToken(token) as TokenPayload;

  if (!payload || !payload.id) {
    next(new Error('Invalid token'));
    return;
  }

  req.auth = payload;
  next();
};

export const optionalAuthenticator = (req: Request, _: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.split('Bearer ')[1];
    const payload = verifyToken(token) as TokenPayload;
    req.auth = payload;
    next();
    return;
  }

  next();
};
