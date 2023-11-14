import { TokenPayload } from 'validator';
import prisma from '../prisma';

export default async function articleFavoritePrisma(slug: string, auth: TokenPayload) {
  const res = await prisma.article.update({
    where: {
      slug,
    },
    data: {
      favoritedBy: {
        connect: {
          id: auth.id,
        },
      },
    },
  });
  
  return res;
}
