import type { Request } from 'express-jwt';
import { ResponseError, TokenPayload } from 'validator';

import { checkArticle } from '../../utils/formatArticle';
import { favoriteArticle } from '../../utils/db/article';

const favoriteArticleService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = req.params;

  const currentArticle = await checkArticle(slug);

  await favoriteArticle(currentArticle.id, auth.id);
};

export default favoriteArticleService;
