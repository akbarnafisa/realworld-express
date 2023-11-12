import {
  usersRegisterInputSchema,
  UserRegisterInputType,
  validate,
  ResponseError,
  userViewer,
  usersLoginInputSchema,
  UserLoginInputType,
  TokenPayload,
} from 'validator';
import { prismaClient } from '../../application/database';
import { checkPassword, createUserToken, hashPassword } from '../../utils/auth';

export const registerService = async (request: Request) => {
  const user = await validate<UserRegisterInputType>(usersRegisterInputSchema, request);

  const { password, ...restInput } = user;

  const res = await prismaClient.user.create({
    data: {
      ...restInput,
      password: hashPassword(password),
    },
  });

  const { id, username, email } = res;
  const payload: TokenPayload = { id, username, email };

  return userViewer(res, createUserToken(payload));
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
  const tokenPayload: TokenPayload = { id, username, email };

  return userViewer(user, createUserToken(tokenPayload));
};
