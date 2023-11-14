import { Article } from '@prisma/client';
import prisma from '../prisma';
import { TokenPayload } from 'validator';

export default async function commentCreatePrisma(body: string, article: Article, auth: TokenPayload) {
  return await prisma.comment.create({
    data: { body, articleId: article.id, authorId: auth.id },
    include: {
      author: {
        select: {
          username: true,
          image: true,
        },
      },
    },
  });
}
