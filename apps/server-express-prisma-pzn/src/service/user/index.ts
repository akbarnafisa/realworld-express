import {
  ResponseError,
  userViewer,
  TokenPayload,
  validate,
  userUpdateInputSchema,
  UserUpdateInputType,
} from 'validator';
import { prismaClient } from '../../application/database';

import { Request } from 'express-jwt';
import { hashPassword } from '../../utils/auth';

export const getCurrentUserService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: auth.id,
    },
  });

  if (!user) {
    throw new ResponseError(404, 'User not found!');
  }

  return userViewer(user);
};

export const updateUserService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { password, ...restInput } = await validate<UserUpdateInputType>(userUpdateInputSchema, request.body);

  const originData = await prismaClient.user.findUnique({
    where: {
      id: auth.id,
    },
  });

  if (!originData) {
    throw new ResponseError(404, 'User not found');
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id: originData.id,
    },
    data: {
      ...restInput,
      password: password ? hashPassword(password) : undefined,
    },
  });

  return userViewer(updatedUser);
};
