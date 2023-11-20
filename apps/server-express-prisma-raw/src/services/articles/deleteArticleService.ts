import type { Request } from 'express-jwt';
import {
  ResponseError,
  TokenPayload,
} from 'validator';

import { checkArticle, checkArticleOwner } from '../../utils/formatArticle';
import { deleteArticleById } from '../../utils/db/article';

const deleteArticleService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = req.params;

  const currentArticle = await checkArticle(slug);
  checkArticleOwner(auth.id, currentArticle.author_id);

  await deleteArticleById(currentArticle.id)
};

export default deleteArticleService;
