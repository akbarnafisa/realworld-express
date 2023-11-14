import prisma from '../prisma';
import { ArticleCreateInputType, TokenPayload } from 'validator';
import slug from 'slug';
import { articleIncludes } from '../../articleChecker';
import tagsCreatePrisma from '../tag/tagsCreatePrisma';
import { Article } from '@prisma/client';

const slugify = (title: string): string => {
  return `${slug(title, { lower: true })}-${((Math.random() * Math.pow(36, 6)) | 0).toString(36)}`;
};

const articleUpdatePrisma = async (
  slug: string,
  data: ArticleCreateInputType,
  auth: TokenPayload,
  originArticle: Article & {
    tags: {
      name: string;
    }[];
  },
) => {
  const tags = await tagsCreatePrisma(data.tagList);

  const isTitleChanged = data.title !== originArticle.title;

  const res = await prisma.article.update({
    where: {
      slug,
    },
    data: {
      title: isTitleChanged ? data.title : undefined,
      slug: isTitleChanged ? slugify(data.title) : undefined,
      body: data.body,
      description: data.description,
      tags: {
        disconnect: originArticle.tags,
        connect: tags,
      },
    },
    include: articleIncludes(auth),
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

export default articleUpdatePrisma;
