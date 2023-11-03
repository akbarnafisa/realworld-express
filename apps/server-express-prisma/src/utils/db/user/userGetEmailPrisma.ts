import { UserLoginInputType } from 'validator';
import prisma from '../prisma';

const userGetEmailPrisma = async (user: UserLoginInputType) => {
  return await prisma.user.findUnique({
    where: {
      email: user.email,
    },
  });
};

export default userGetEmailPrisma;
