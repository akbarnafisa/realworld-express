import prisma from '../prisma';

const userGetPrisma = async (id: number) => {
  if (!id) {
    return null;
  }

  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};


export default userGetPrisma