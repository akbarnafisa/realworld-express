

import prisma from '../prisma';

export default async function commentDeletePrisma(id: number) {
  return await prisma.comment.delete({
    where: { id },
  });
}
