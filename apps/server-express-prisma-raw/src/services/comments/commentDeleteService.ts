import type { Request } from 'express-jwt';
import { ResponseError, TokenPayload } from 'validator';

import { checkArticle } from '../../utils/formatArticle';
import { deleteComment, getCommentById } from '../../utils/db/comments';
import { CommentModel } from '../../utils/types';

const deleteArticleService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug, commentId } = req.params;

  await checkArticle(slug);

  const originComment = await checkComment(Number(commentId));

  checkCommentOwner(auth.id, originComment.author_id);

  await deleteComment(originComment.id);
};


const checkComment = async (commentId: number) => {
  const data = await getCommentById(commentId);
  const result = data?.rows[0] as CommentModel;

  if (!result) {
    throw new ResponseError(404, 'Comment not found!');
  }

  return result;
};


const checkCommentOwner = (currentUserId: number, commentUserId: number) => {
  if (currentUserId !== commentUserId) {
    throw new ResponseError(401, 'User unathorized!');
  }
};

export default deleteArticleService;
