import { User } from '@prisma/client';
import type { ProfileResponseType } from './type';

export const userViewer = (user: User): ProfileResponseType => {
  return  {
    user: {
      following: false,
      username: user.username,
      bio: user.bio,
      image: user.image,
    },
  };;
};
