export interface ICommentQueryParams {
  limit?: number;
  offset?: number;
}

type Required<T> = {
  [K in keyof T]-?: T[K];
};

export type ICommentQueryRequiredParams = Required<ICommentQueryParams>;
