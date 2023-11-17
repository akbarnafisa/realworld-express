import { Request } from 'express-jwt';
import { ResponseError, TokenPayload, userViewer } from 'validator';
import pool from '../../app/db';
import { UserModel } from '../../utils/types';

export const userGetServiceQuery = 'SELECT * from blog_user WHERE(id = $1 AND 1=1) LIMIT 1 OFFSET 0';

const getCurrentUserService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const getUser = await pool.query(userGetServiceQuery, [auth.id]);
  const user = getUser?.rows[0] as UserModel;

  if (!user) {
    throw new ResponseError(404, 'User not found!');
  }

  return userViewer(user)
};

export default getCurrentUserService;
