import { Request } from 'express-jwt';
import { ResponseError, TokenPayload, profileViewer } from 'validator';
import { UserModel } from '../../utils/types';
import { getProfile } from '../../utils/db/profile';
import { getUserByUsername } from '../../utils/db/users';

const getProfileService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  const { username } = req.params;

  const getUserQuery = await getUserByUsername(username);
  const followingUser = getUserQuery?.rows[0] as UserModel;

  if (!followingUser) {
    throw new ResponseError(404, 'User not found!');
  }

  const getUser = await getProfile(auth?.id || -1, followingUser.id);
  const { follower_id, ...user } = getUser?.rows[0] as UserModel & {
    follower_id: number;
  };

  return profileViewer(user, {
    following: follower_id > 0,
  });
};

export default getProfileService;
