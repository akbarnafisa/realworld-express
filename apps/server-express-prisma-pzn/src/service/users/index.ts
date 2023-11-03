import {
  usersRegisterInputSchema,
  UserRegisterInputType,
  validate,
  ResponseError,
  userViewer,
  usersLoginInputSchema,
  UserLoginInputType,
} from 'validator';
import { prismaClient } from '../../application/database';
import { checkPassword, createUserToken, hashPassword } from '../../utils/auth';
import { Prisma } from '@prisma/client';

export const registerService = async (request: Request) => {
  const user = await validate<UserRegisterInputType>(usersRegisterInputSchema, request);

  try {
    const { password, ...restInput } = user;

    const res = await prismaClient.user.create({
      data: {
        ...restInput,
        password: hashPassword(password),
      },
    });

    const { id, username, email } = res;
    const payload = { id, username, email };

    return userViewer(res, createUserToken(payload));
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new ResponseError(422, 'Username or email had been used');
      }
    }
    return null;
  }
};

export const loginService = async (request: Request) => {
  const inputUser = await validate<UserLoginInputType>(usersLoginInputSchema, request);
  const user = await prismaClient.user.findUnique({
    where: {
      email: inputUser.email,
    },
  });

  if (!user) {
    throw new ResponseError(422, 'Email or password is not correct!');
  }

  const isPasswordCorrect = checkPassword(inputUser.password, user.password);

  if (!isPasswordCorrect) {
    throw new ResponseError(422, 'Email or password is not correct!');
  }
  
  const { id, username, email } = user;
  const tokenPayload = { id, username, email };

  return userViewer(user, createUserToken(tokenPayload));
};
