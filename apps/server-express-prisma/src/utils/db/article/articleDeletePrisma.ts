import prisma from '../prisma';

export default async function articleDeletePrisma(slug: string) {
  const res = await prisma.article.delete({
    where: { slug },
  });

  return res;
}
