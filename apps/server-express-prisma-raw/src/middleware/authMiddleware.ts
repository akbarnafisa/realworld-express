import type { Request } from 'express';
import { expressjwt as jwt } from 'express-jwt';

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET missing in environment.');
}

const getToken = (req: Request) => {
  const auth = req.headers.authorization;
  if (!auth) return;
  if (auth.split(' ').length != 2) return;
  const [tag, token] = auth.split(' ');
  if (tag === 'Bearer') return token;
  return;
};

export const authenticate = jwt({
  algorithms: ['HS256'],
  secret,
  getToken,
});

export const optionalAuth = jwt({
  algorithms: ['HS256'],
  secret,
  credentialsRequired: false,
  getToken,
});
