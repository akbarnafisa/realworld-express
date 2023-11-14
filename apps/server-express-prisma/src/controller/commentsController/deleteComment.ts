import type { RequestHandler } from 'express';
import { ResponseError, TokenPayload, responseFormat } from 'validator';
import { checkArticle } from '../../utils/articleChecker';
import commentDeletePrisma from '../../utils/db/comment/commentDeletePrisma';
import prisma from '../../utils/db/prisma';

const deleteComment: RequestHandler = async (request, res, next) => {
  try {
    const auth = request?.auth as TokenPayload | undefined;

    if (!auth || !auth.id) {
      throw new ResponseError(401, 'User unauthenticated!');
    }

    const { slug, commentId } = request.params;

    await checkArticle(slug);
    const originComment = await checkComment(Number(commentId));
    checkCommentOwner(auth.id, originComment.authorId);

    await commentDeletePrisma(Number(commentId));

    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: null,
      }),
    );
  } catch (error) {
    next(error);
  }
};

const checkComment = async (commentId: number) => {
  const data = await prisma.comment.findUnique({
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


export default deleteComment;
