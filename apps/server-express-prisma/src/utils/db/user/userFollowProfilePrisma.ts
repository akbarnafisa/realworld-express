import prisma from '../prisma';

export default async function userFollowProfilePrisma(followUserId: number, currentUserId: number) {
  const res = await prisma.user.update({
    where: {
      id: followUserId,
    },
    data: {
      followedBy: {
        connect: {
          id: currentUserId
        },
      },
    },
  });

  return res;
}
