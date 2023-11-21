import type { Request } from 'express-jwt';
import { ResponseError, TokenPayload, articleViewer, ArticleExtendInfo } from 'validator';
import { getFullArticleBySlug } from '../../utils/db/article';

import { checkArticle } from '../../utils/formatArticle';

const createArticleService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = req.params;
  await checkArticle(slug);

  const articleQuery = await getFullArticleBySlug(slug, auth.id);
  const articleData = articleQuery?.rows[0] as ArticleExtendInfo;

  return articleViewer(articleData);
};

export default createArticleService;
