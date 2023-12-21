export interface IArtilceQueryParams {
  limit?: number;
  offset?: number;
  tag: string | undefined;
  author: string | undefined;
  favorited: string | undefined;
}

type Required<T> = {
  [K in keyof T]-?: T[K];
};

export type IArticleQueryRequiredParams = Required<IArtilceQueryParams>;
