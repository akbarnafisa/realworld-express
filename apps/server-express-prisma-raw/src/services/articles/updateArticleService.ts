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
import { connectArticleTag, updateArticle, getFullArticleBySlug } from '../../utils/db/article';

import { ArticleModel } from '../../utils/types';
import { checkArticle, checkArticleOwner } from '../../utils/formatArticle';
import { updateTag } from '../../utils/db/tags';

const createArticleService = async (req: Request) => {
  const auth = req.auth as TokenPayload | undefined;

  if (!auth) {
    throw new ResponseError(401, 'User unauthenticated!');
  }

  const { slug } = req.params;

  const currentArticle = await checkArticle(slug);
  checkArticleOwner(auth.id, currentArticle.author_id);


  const inputData = await validate<ArticleCreateInputType>(articleInputSchema, req.body);

  const isTitleChanged = currentArticle.title !== inputData.title


  const [inputArticle, tagIds] = await Promise.all([
    updateArticle({
      ...inputData,
      title: isTitleChanged ?  inputData.title : undefined,
    }, slug),
    updateTag(inputData.tagList, currentArticle.id),
  ]);
  const InputedArticle = inputArticle?.rows[0] as ArticleModel;

  await connectArticleTag(tagIds, InputedArticle.id);

  const articleQuery = await getFullArticleBySlug(InputedArticle.slug, auth.id);
  const articleData = articleQuery?.rows[0] as ArticleExtendInfo;

  return articleViewer(articleData);
};

export default createArticleService;
