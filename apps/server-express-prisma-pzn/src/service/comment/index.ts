import { Request } from 'express-jwt';
import {
  ResponseError,
  TokenPayload,
  validate,
  CommentInputType,
  commentInputSchema,
  commentViewer,
  commentsViewer,
} from 'validator';
import { prismaClient } from '../../application/database';
import { checkArticle } from '../article';

export const getCommentsService = async (request: Request) => {
  const { slug } = request.params;
  const { limit, offset, cursor } = request.query;

  const article = await checkArticle(slug);

  let skip, take;

  if (cursor) {
    skip = 1;
    take = Number(limit);
  } else {
    skip = Number(offset) || undefined;
    take = Number(limit) || undefined;
  }

  const data = await prismaClient.comment.findMany({
    where: {
      articleId: article.id,
    },
    skip: skip || 0,
    take: take || 10,
    cursor: cursor ? { id: Number(cursor) } : undefined,
    orderBy: {
      createdAt: 'asc',
    },
    include: {
      author: {
        select: {
          username: true,
          image: true,
        },
      },
    },
  });

  return commentsViewer(data);
};

export const createCommentService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = request.params;

  const article = await checkArticle(slug);

  const { body } = await validate<CommentInputType>(commentInputSchema, request.body);

  const comment = await prismaClient.comment.create({
    data: {
      body,
      aritcle: {
        connect: {
          id: article.id
        },
      },
      author: {
        connect: {
          id: auth.id,
        },
      },
    },
    include: {
      author: {
        select: {
          username: true,
          image: true,
        },
      },
    },
  });

  return commentViewer(comment);
};

export const deleteCommentService = async (request: Request) => {
  const auth = request?.auth as TokenPayload | undefined;

  if (!auth || !auth.id) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = request.params;

  await checkArticle(slug);

  const { commentId } = request.params;

  const originComment = await checkComment(Number(commentId));
  checkCommentOwner(auth.id, originComment.authorId);

  await prismaClient.comment.delete({
    where: { id: originComment.id },
  });

  return {
    success: true,
  };
};

const checkComment = async (commentId: number) => {
  const data = await prismaClient.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!data) {
    throw new ResponseError(404, 'Comment not found!');
  }

  return data;
};

const checkCommentOwner = (currentUserId: number, commentUserId: number) => {
  if (currentUserId !== commentUserId) {
    throw new ResponseError(401, 'User unathorized!');
  }
};
