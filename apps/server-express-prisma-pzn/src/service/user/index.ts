import { ResponseError, userViewer, TokenPayload } from 'validator';
import { prismaClient } from '../../application/database';

import { Request } from 'express-jwt';

export const getCurrentUserService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth) {
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
