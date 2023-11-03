import { UserRegisterInputType } from 'validator';
import prisma from '../prisma';

const userCreatePrisma = async ({ username, email, password }: UserRegisterInputType) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      password,
    },
  });
};

export default userCreatePrisma