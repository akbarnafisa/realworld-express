import type { UserAuthResponseType } from '../users/type';

type Comment = {
  body: string; // String!
  createdAt: Date; // DateTime!
  id: number; // Int!
  updatedAt: Date; // DateTime!
  user: {
    username: UserAuthResponseType['user']['username'];
    image: UserAuthResponseType['user']['image'];
  };
};

export interface CommentResponseType {
  comment: Comment;
}
export interface CommentsResponseType {
  comments: Comment[];
}
