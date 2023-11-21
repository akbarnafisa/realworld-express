import type { Request } from 'express-jwt';
import { ResponseError, TokenPayload } from 'validator';

import { checkArticle } from '../../utils/formatArticle';
import { unFavoriteArticle } from '../../utils/db/article';

const unFavoriteArticleService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = req.params;
  const currentArticle = await checkArticle(slug);

  await unFavoriteArticle(currentArticle.id, auth.id);
};

export default unFavoriteArticleService;
