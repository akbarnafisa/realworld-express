import { Request } from 'express-jwt';
import {
  ResponseError,
  TokenPayload,
  validate,
  ArticleCreateInputType,
  articleInputSchema,
  articleViewer,
} from 'validator';
import { prismaClient } from '../../application/database';
import slug from 'slug';

const slugify = (title: string): string => {
  return `${slug(title, { lower: true })}-${((Math.random() * Math.pow(36, 6)) | 0).toString(36)}`;
};

export const createArticleService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { body, description, title } = await validate<ArticleCreateInputType>(articleInputSchema, request.body);

  const data = await prismaClient.article.create({
    data: {
      body,
      description,
      title,
      slug: slugify(title),
      authorId: auth.id,
    },
  });

  return articleViewer(data);
};

export const getArticleService = async (request: Request) => {
  console.log(request);
};

export const deleteArticleService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = request.params;

  const originArticle = await checkArticle(slug)
  checkArticleOwner(auth.id, originArticle.authorId)

  await prismaClient.article.delete({
    where: {
      slug,
    },
  });

  return {
    success: true,
  };
};

export const updateArticleService = async (request: Request) => {
  console.log(request);
};

const checkArticle = async (slug: string) => {
  const data = await prismaClient.article.findUnique({
    where: {
      slug
    }
  })

  if (!data) {
    throw new ResponseError(404, 'Article not found!')
  }

  return data
}


const checkArticleOwner = (currentUserId: number, authorId: number) => {
  if (currentUserId !== authorId) {
    throw new ResponseError(401, "User unauthorized!")
  }
}