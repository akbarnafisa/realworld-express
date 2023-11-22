import type { Request } from 'express-jwt';
import {
  ResponseError,
  TokenPayload,
  validate,
  CommentType,
  CommentInputType,
  commentInputSchema,
  commentViewer,
} from 'validator';

import { createComment } from '../../utils/db/comments';
import { checkArticle } from '../../utils/formatArticle';

const createArticleService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = req.params;

  const articleData = await checkArticle(slug);

  const inputData = await validate<CommentInputType>(commentInputSchema, req.body);

  const commentQuery = await createComment(inputData, auth.id, articleData.id);
  const commentData = commentQuery?.rows[0] as CommentType;

  return commentViewer(commentData);
};

export default createArticleService;
