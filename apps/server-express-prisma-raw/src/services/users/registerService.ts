import type { Request } from 'express';
import { User } from '@prisma/client';

import pool from '../../app/db';
import { UserRegisterInputType, userViewer, usersRegisterInputSchema, validate } from 'validator';
import { generateToken, hasPassword } from '../../utils/encryption';

const registerService = async (req: Request) => {
  const { email, password, username } = await validate<UserRegisterInputType>(usersRegisterInputSchema, req.body);
  const query = 'INSERT INTO blog_user(email, password, username) values($1, $2, $3) RETURNING *';
  const values = [email, hasPassword(password), username];
  const result = await pool.query(query, values);
  const data = result.rows[0] as User;

  const token = generateToken({
    email: data.email,
    id: data.id,
    username: data.username,
  });

  return userViewer(data, token);
};

export default registerService;
