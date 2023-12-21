import {
  IArticleQueryRequiredParams,
  IArtilceQueryParams,
} from './article.interface';

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

export const parseQueryParams = (
  query: IArtilceQueryParams,
): IArticleQueryRequiredParams => {
  const { limit, offset, tag, author, favorited } = query;

  const parsedParams = {
    limit: limit !== undefined ? +limit : DEFAULT_LIMIT,
    offset: offset !== undefined ? +offset : DEFAULT_OFFSET,
    tag: tag !== undefined ? tag : undefined,
    author: author !== undefined ? author : undefined,
    favorited: favorited !== undefined ? favorited : undefined,
  };

  return parsedParams;
};
