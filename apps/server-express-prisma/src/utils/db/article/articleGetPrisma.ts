import { TokenPayload } from 'validator';
import prisma from '../prisma';
import { articleIncludes } from '../../articleChecker';

export default async function articleGetPrisma(slug: string, auth: TokenPayload | undefined) {
  const res = await prisma.article.findUnique({
    where: { slug },
    include: articleIncludes(auth)
  });

  return res
    ? {
        ...res,
        author: {
          ...res.author,
          followedBy: res.author.followedBy?.map((data) => ({
            followerId: data.id,
          })),
        },
        tags: res.tags?.map((data) => ({
          tag: data,
        })),
        favoritedBy: res.favoritedBy?.map((data) => ({
          userId: data.id,
        })),
      }
    : null;
}
