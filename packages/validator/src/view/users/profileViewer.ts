import { User } from '@prisma/client';

import type { ProfileResponseType } from './type';

export const profileViewer = (
  user: User,
  {
    following,
  }: {
    following: boolean;
  },
): ProfileResponseType => {
  return {
    user: {
      following,
      username: user.username,
      bio: user.bio,
      image: user.image,
    },
  };
};
