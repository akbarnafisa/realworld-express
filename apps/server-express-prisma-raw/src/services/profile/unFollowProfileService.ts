import type { Request } from 'express-jwt';
import { ResponseError, TokenPayload } from 'validator';

import { unFollowProfile } from '../../utils/db/profile';
import { getUserByUsername } from '../../utils/db/users';
import { UserModel } from '../../utils/types';

const unFollowProfileService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { username } = req.params;

  const getUser = await getUserByUsername(username);
  const followingUser = getUser?.rows[0] as UserModel;

  if (!followingUser) {
    throw new ResponseError(404, 'User not found!');
  }

  if (followingUser.id === auth.id) {
    throw new ResponseError(422, 'Unable to unfollow yourself');
  }

  await unFollowProfile(auth.id, followingUser.id);
};

export default unFollowProfileService;
