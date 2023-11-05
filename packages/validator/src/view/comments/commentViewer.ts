import { Comment, User } from '@prisma/client';

import type { CommentResponseType } from './type';

interface CommentType extends Comment {
  username: User['username']
  image: User['image']
}

export const commentViewer = (comments: CommentType[]): CommentResponseType => {
  return {
    comments: comments.map((comment) => ({
      body: comment.body,
      createdAt: comment.createdAt,
      id: comment.id,
      updatedAt: comment.updatedAt,
      username: comment.username,
      image: comment.image,
    })),
  };
};
