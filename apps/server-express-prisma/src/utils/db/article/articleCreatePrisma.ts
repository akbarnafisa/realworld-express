import prisma from '../prisma';
import { ArticleCreateInputType, TokenPayload } from 'validator';
import slug from 'slug';
import tagsCreatePrisma from '../tag/tagsCreatePrisma';

const slugify = (title: string): string => {
  return `${slug(title, { lower: true })}-${((Math.random() * Math.pow(36, 6)) | 0).toString(36)}`;
};

const articleCreatePrisma = async (data: ArticleCreateInputType, auth: TokenPayload) => {
  const tags = await tagsCreatePrisma(data.tagList);

  const res = await prisma.article.create({
    data: {
      body: data.body,
      description: data.description,
      title: data.title,
      slug: slugify(data.title),
      authorId: auth.id,
      tags: { connect: tags },
    },
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
              id: auth.id,
            },
          },
        },
      },
      favoritedBy: {
        select: {
          id: true,
        },
        where: {
          id: auth.id,
        },
      },
      tags: true,
      _count: { select: { favoritedBy: true } },
    },
  });

  return {
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
  };
};

export default articleCreatePrisma;
