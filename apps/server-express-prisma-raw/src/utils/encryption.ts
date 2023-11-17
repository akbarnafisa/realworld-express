import bcrypt from 'bcrypt';
import { TokenPayload } from 'validator';
import jwt from 'jsonwebtoken';

const TOKEN = process.env.JWT_SECRET;

export const hasPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const encryptPassword = (password: string, hashedPassword: string) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export const generateToken = (payload: TokenPayload) => {
  if (!TOKEN) {
    throw new Error('JWT_SECRET missing in environment');
  }
  return jwt.sign(payload, TOKEN, { expiresIn: '7d' });
};
