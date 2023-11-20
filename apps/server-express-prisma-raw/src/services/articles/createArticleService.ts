import type { Request } from 'express-jwt';
import {
  ResponseError,
  TokenPayload,
  articleInputSchema,
  ArticleCreateInputType,
  validate,
  articleViewer,
} from 'validator';
import createTag from '../../utils/db/tags/createTag';
import { connectArticleTag, createArticle } from '../../utils/db/article';

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

  return articleViewer({
    ...InputedArticle,
    updatedAt: InputedArticle.updated_at,
    createdAt: InputedArticle.created_at,
    authorId: InputedArticle.author_id,
    author: { followedBy: [], username: 'asxxoi', image: 'https://123.com' }, // TODO
    favoritedBy: [], // TODO
    tags: tagIds.map((tag) => ({ tag: { name: tag.name } })),
    _count: { favoritedBy: 0 }, // TODO
  });
};

export default createArticleService;
