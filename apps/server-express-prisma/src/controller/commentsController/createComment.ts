import type { RequestHandler } from 'express';
import { CommentInputType, ResponseError, TokenPayload, commentInputSchema, commentViewer, responseFormat, validate } from 'validator';
import { checkArticle } from '../../utils/articleChecker';
import commentCreatePrisma from '../../utils/db/comment/commentCreatePrisma';

const createComment: RequestHandler = async (request, res, next) => {
  try {
    const auth = request?.auth as TokenPayload | undefined;

    if (!auth || !auth.id) {
      throw new ResponseError(401, 'User unauthenticated!');
    }

    const { slug } = request.params;

    const article = await checkArticle(slug);

    const { body } = await validate<CommentInputType>(commentInputSchema, request.body);

    const comment= await commentCreatePrisma(body, article, auth);

    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: commentViewer(comment),
      }),
    );
  } catch (error) {
    next(error);
  }
};

export default createComment;
