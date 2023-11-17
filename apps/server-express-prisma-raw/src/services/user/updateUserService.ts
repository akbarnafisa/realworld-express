import { Request } from 'express-jwt';
import {
  ResponseError,
  TokenPayload,
  UserUpdateInputType,
  userUpdateInputSchema,
  userViewer,
  validate,
} from 'validator';
import pool from '../../app/db';
import { UserModel } from '../../utils/types';
import { userGetServiceQuery } from './getCurrentUserService';

const userUpdateUserServiceQuery = (data: Partial<UserUpdateInputType>, id: number) => {
  const inputData = Object.keys(data)
    .map((key, index) => {
      return `${key} = $${index + 2}`;
    })
    .join(', ');

  const query = `UPDATE blog_user SET ${inputData} WHERE (id = $1 AND 1=1) RETURNING *`;
  const values = [id, ...Object.values(data)];

  return {
    query,
    values,
  };
};

const updateUserService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const getUser = await pool.query(userGetServiceQuery, [auth.id]);
  const user = getUser?.rows[0] as UserModel;

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }

  const data = await validate<UserUpdateInputType>(userUpdateInputSchema, req.body);

  const { query, values } = userUpdateUserServiceQuery(data, user.id);

  const updateUser = await pool.query(query, values);
  const updatedUser = updateUser?.rows[0] as UserModel;

  return userViewer(updatedUser);
};

export default updateUserService;
