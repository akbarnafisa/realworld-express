import type { Request } from 'express-jwt';
import {
  ResponseError,
  TokenPayload,
  articleInputSchema,
  ArticleCreateInputType,
  validate,
  articleViewer,
  ArticleExtendInfo,
} from 'validator';
import createTag from '../../utils/db/tags/createTag';
import { connectArticleTag, createArticle, getFullArticleBySlug } from '../../utils/db/article';

import { ArticleModel } from '../../utils/types';

const createArticleService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const inputData = await validate<ArticleCreateInputType>(articleInputSchema, req.body);
  const [inputArticle, tagIds] = await Promise.all([createArticle(inputData, auth), createTag(inputData.tagList)]);
  const InputedArticle = inputArticle?.rows[0] as ArticleModel;

  await connectArticleTag(tagIds, InputedArticle.id);

  const articleQuery = await getFullArticleBySlug(InputedArticle.slug, auth.id);
  const articleData = articleQuery?.rows[0] as ArticleExtendInfo;

  return articleViewer(articleData);
};

export default createArticleService;
