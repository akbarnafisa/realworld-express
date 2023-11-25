import type { Request } from 'express-jwt';
import {  TokenPayload, articleViewer, ArticleExtendInfo } from 'validator';
import { getFullArticleBySlug } from '../../utils/db/article';

import { checkArticle } from '../../utils/formatArticle';

const getArticleService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  const { slug } = req.params;
  await checkArticle(slug);

  const articleQuery = await getFullArticleBySlug(slug, auth?.id);
  const articleData = articleQuery?.rows[0] as ArticleExtendInfo;

  return articleViewer(articleData);
};

export default getArticleService;
