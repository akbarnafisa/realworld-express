import { Comment } from '@prisma/client';
export class CommentEntity implements Comment {
  id: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  articleId: number;
  authorId: number;
}

export class CommentWithRelationEntity extends CommentEntity {
  author: {
    username: string;
    image: string | null;
  };
}
