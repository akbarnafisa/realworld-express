import {
  ICommentQueryParams,
  ICommentQueryRequiredParams,
} from './comment.interface';

const DEFAULT_LIMIT = 20;
const DEFAULT_OFFSET = 0;

export const parseQueryParams = (
  query: ICommentQueryParams,
): ICommentQueryRequiredParams => {
  const { limit, offset } = query;

  const parsedParams = {
    limit: limit !== undefined ? +limit : DEFAULT_LIMIT,
    offset: offset !== undefined ? +offset : DEFAULT_OFFSET,
  };

  return parsedParams;
};
