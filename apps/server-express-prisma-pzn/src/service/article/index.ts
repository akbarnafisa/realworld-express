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

  console.log({ body: request.body });

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
  console.log(request);
};

export const updateArticleService = async (request: Request) => {
  console.log(request);
};
