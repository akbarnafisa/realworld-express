import { TokenPayload } from 'validator';
import prisma from '../prisma';

export default async function articleGetPrisma(slug: string, auth: TokenPayload | undefined) {
  const res = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          username: true,
          image: true,
          followedBy: {
            select: {
              id: true,
            },
            where: {
              id: auth?.id,
            },
          },
        },
      },
      favoritedBy: {
        select: {
          id: true,
        },
        where: {
          id: auth?.id,
        },
      },
      tags: true,
      _count: { select: { favoritedBy: true } },
    },
  });

  return res
    ? {
        ...res,
        author: {
          ...res.author,
          followedBy: res.author.followedBy.map((data) => ({
            followerId: data.id,
          })),
        },
        tags: res.tags.map((data) => ({
          tag: data,
        })),
        favoritedBy: res.favoritedBy.map((data) => ({
          userId: data.id,
        })),
      }
    : null;
}
