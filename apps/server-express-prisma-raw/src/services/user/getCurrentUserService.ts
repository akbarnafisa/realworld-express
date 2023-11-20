import { Request } from 'express-jwt';
import { ResponseError, TokenPayload, userViewer } from 'validator';
import { UserModel } from '../../utils/types';
import { getUserByEmail } from '../../utils/db/users';

const getCurrentUserService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const getUser = await getUserByEmail(auth.email);
  const user = getUser?.rows[0] as UserModel;

  if (!user) {
    throw new ResponseError(404, 'User not found!');
  }

  return userViewer(user);
};

export default getCurrentUserService;
