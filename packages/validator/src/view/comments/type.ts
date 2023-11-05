import type {UserAuthResponseType} from '../users/type'

export interface CommentResponseType {
  comments: {
    body: string; // String!
    createdAt: Date; // DateTime!
    id: number; // Int!
    updatedAt: Date; // DateTime!
    username: UserAuthResponseType['user']['username'];
    image: UserAuthResponseType['user']['image'];
  }[];
}
