import { TokenPayload } from 'validator';
import prisma from '../prisma';

export default async function articleUnFavoritePrisma(slug: string, auth: TokenPayload) {
  const res = await prisma.article.update({
    where: {
      slug,
    },
    data: {
      favoritedBy: {
        disconnect: {
          id: auth.id,
        },
      },
    },
  });
  
  return res;
}
