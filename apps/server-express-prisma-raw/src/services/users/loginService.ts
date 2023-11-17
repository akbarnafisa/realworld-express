import type { Request } from 'express';
import { User } from '@prisma/client';

import pool from '../../app/db';
import { ResponseError, UserLoginInputType, userViewer, usersLoginInputSchema, validate } from 'validator';
import { generateToken, encryptPassword } from '../../utils/encryption';

const loginService = async (req: Request) => {
  const { email, password } = await validate<UserLoginInputType>(usersLoginInputSchema, req.body);

  const getUserPassword = await pool.query('SELECT * from blog_user WHERE email = $1', [email]);
  const user = getUserPassword?.rows[0] as User;

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
