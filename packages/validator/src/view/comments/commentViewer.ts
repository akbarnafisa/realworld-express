import { Comment, User } from '@prisma/client';

import type { CommentResponseType, CommentsResponseType } from './type';

type CommentType = Comment & {
  author: {
    username: string;
    image: string | null;
  };
};

export const commentViewer = (comment: CommentType): CommentResponseType => {
  return {
    comment: {
      body: comment.body,
      createdAt: comment.createdAt,
      id: comment.id,
      updatedAt: comment.updatedAt,
      user: {
        username: comment.author.username,
        image: comment.author.image,
      },
    },
  };
};

export const commentsViewer = (
  comments: CommentType[],
  opt?: {
    nextCursor?: number | null;
    hasMore?: boolean;
    commentsCount?: number
  },
): CommentsResponseType => {
  const commentsItem = comments.map((comment) => {
    return commentViewer(comment).comment;
  });
  return {
    comments: commentsItem,
    nextCursor: opt?.nextCursor,
    hasMore: opt?.hasMore,
    commentsCount: opt?.commentsCount
  };
};
