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
    tags?: string[];
    author?: {
      username: string;
      image: string | null;
      following: boolean;
    };
  };
}

export interface ArticlesResponseType {
  articles: ArticleResponseType['article'][];
  nextCursor?: ArticleResponseType['article']['id'] | null;
  articlesCount?: number;
  hasMore?: boolean;
}
