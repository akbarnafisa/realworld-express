import { TokenPayload } from 'validator';
import prisma from '../prisma';

const userGetProfile = async (username: string, auth?: TokenPayload) => {
  let following = false;

  if (auth) {
    const getFollowerUser = await prisma.user
      .findUnique({
        where: {
          username,
        },
      })
      .followedBy({
        select: {
          id: true,
        },
        where: {
          id: auth.id,
        },
      });
    following = !!getFollowerUser?.length;
  }
  const data = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  return { data, following };
};

export default userGetProfile;
