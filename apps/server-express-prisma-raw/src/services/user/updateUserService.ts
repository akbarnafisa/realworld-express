import { Request } from 'express-jwt';
import {
  ResponseError,
  TokenPayload,
  UserUpdateInputType,
  userUpdateInputSchema,
  userViewer,
  validate,
} from 'validator';
import { UserModel } from '../../utils/types';
import { getUserByEmail, updateUser } from '../../utils/db/users';

const updateUserService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const getUser = await getUserByEmail(auth.email);
  const user = getUser?.rows[0] as UserModel;

  if (!user) {
    throw new ResponseError(404, 'User not found');
  }

  const data = await validate<UserUpdateInputType>(userUpdateInputSchema, req.body);

  const updateUserDb = await updateUser(data, user.id);
  const updatedUser = updateUserDb?.rows[0] as UserModel;

  return userViewer(updatedUser);

};

export default updateUserService;
