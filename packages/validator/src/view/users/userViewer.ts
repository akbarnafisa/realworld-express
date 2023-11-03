import { User } from '@prisma/client';
import type { UserAuthResponseType } from './type';

export const userViewer = (user: User, token?: string): UserAuthResponseType => {
  return  {
    user: {
      email: user.email,
      token: token,
      username: user.username,
      bio: user.bio,
      image: user.image,
    },
  };;
};


