import { UserUpdateInputType } from 'validator';
import prisma from '../prisma';

interface PayloadType extends UserUpdateInputType {
  password?: string;
}

const userUpdatePrisma = async (payload: PayloadType, id: number) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
};

export default userUpdatePrisma;
