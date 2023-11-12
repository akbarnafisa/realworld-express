import { User } from '@prisma/client';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

dotenv.config();

export const createUserToken = (user: Pick<User, 'id' | 'email' | 'username'>) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET missing in environment');
  }

  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    secret,
    {
      expiresIn: '7d',
    },
  );
};

const saltRounds = 10;
export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, saltRounds);
};

export const checkPassword = (password: string, hash: string) => {
  return bcrypt.compareSync(password, hash);
};
