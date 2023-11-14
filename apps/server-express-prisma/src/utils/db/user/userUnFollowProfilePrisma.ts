import prisma from '../prisma';

export default async function userUnFollowProfilePrisma(followUserId: number, currentUserId: number) {
  const res = await prisma.user.update({
    where: {
      id: followUserId,
    },
    data: {
      followedBy: {
        disconnect: {
          id: currentUserId,
        },
      },
    },
  });

  return res;
}
