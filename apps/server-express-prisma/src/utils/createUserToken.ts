import { User } from '@prisma/client';
import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

export default function createUserToken(user: Pick<User, 'id' | 'email' | 'username'>) {
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
}
