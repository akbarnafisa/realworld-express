export interface UserAuthResponseType {
  user: {
    bio?: string | null; // String
    email: string; // String!
    image?: string | null; // String
    token?: string | null; // String
    username: string; // String!
  };
}
