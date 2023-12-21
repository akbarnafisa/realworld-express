import { Article, User, Follows, Tags, Favorites } from '@prisma/client';
export class ArticleEntity implements Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
}

type AritlceAuthor = Pick<User, 'username' | 'image'>;

export class ArticleWithRelationEntity extends ArticleEntity {
  tags: {
    tag: Tags;
  }[];
  author: AritlceAuthor & {
    followedBy?: Follows[];
  };
  favoritedBy: Favorites[];
  _count?: {
    favoritedBy: number;
  };
}
