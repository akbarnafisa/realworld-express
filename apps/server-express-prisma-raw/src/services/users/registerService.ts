import type { Request } from 'express';

import pool from '../../app/db';
import { UserRegisterInputType, userViewer, usersRegisterInputSchema, validate } from 'validator';
import { generateToken, hasPassword } from '../../utils/encryption';
import { UserModel } from '../../utils/types';

const registerService = async (req: Request) => {
  const { email, password, username } = await validate<UserRegisterInputType>(usersRegisterInputSchema, req.body);
  const query = 'INSERT INTO blog_user(email, password, username) values($1, $2, $3) RETURNING *';
  const values = [email, hasPassword(password), username];
  const result = await pool.query(query, values);
  const data = result.rows[0] as UserModel;

  const token = generateToken({
    email: data.email,
    id: data.id,
    username: data.username,
  });

  return userViewer(data, token);
};

export default registerService;
