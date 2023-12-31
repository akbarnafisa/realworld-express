import type { Request } from 'express';

import { ResponseError, UserLoginInputType, userViewer, usersLoginInputSchema, validate } from 'validator';
import { generateToken, encryptPassword } from '../../utils/encryption';
import { UserModel } from '../../utils/types';
import { getUserByEmail } from '../../utils/db/users';

const loginService = async (req: Request) => {
  const { email, password } = await validate<UserLoginInputType>(usersLoginInputSchema, req.body);

  const getUserPassword = await getUserByEmail(email)
  const user = getUserPassword?.rows[0] as UserModel;

  if (!user) {
    throw new ResponseError(422, 'Email or password is not correct!');
  }

  const checkPassword = encryptPassword(password, user.password);

  if (!checkPassword) {
    throw new ResponseError(422, 'Email or password is not correct!');
  }

  const token = generateToken({
    email: user.email,
    id: user.id,
    username: user.username,
  });

  return userViewer(user, token);
};

export default loginService;
