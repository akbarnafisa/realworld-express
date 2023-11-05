export interface ArticleResponseType {
  article: {
    body: string; // String!
    createdAt: Date; // DateTime!
    description: string; // String!
    favoritesCount?: number; // Int!
    id: number; // Int!
    slug: string; // String!
    title: string; // String!
    updatedAt: Date; // DateTime!
    authorId: number;
    favorited: boolean;
    // tagList
  };
}
