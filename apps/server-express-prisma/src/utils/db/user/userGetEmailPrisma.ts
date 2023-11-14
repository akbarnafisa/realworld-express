import { TokenPayload, UserLoginInputType } from 'validator';
import prisma from '../prisma';

const userGetEmailPrisma = async (user: UserLoginInputType | TokenPayload) => {
  return await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
};

export default userGetEmailPrisma;
