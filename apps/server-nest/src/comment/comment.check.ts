import { HttpException, HttpStatus } from '@nestjs/common';
import { CommentRepository } from './comment.repository';

export class CommentCheck {
  constructor(private commentRepository: CommentRepository) {}

  checkComment<T>(data: T): NonNullable<T> {
    if (!data) {
      throw new HttpException('Comment not found!', HttpStatus.NOT_FOUND);
    }

    return data as NonNullable<T>;
  }

  checkCommentOwner(currentUserId: number, authorId: number) {
    if (currentUserId !== authorId) {
      throw new HttpException('User unauthorized!', HttpStatus.UNAUTHORIZED);
    }
  }

  async checkExistComment(commentId: number) {
    const data = await this.commentRepository.getCommentById(commentId);
    return this.checkComment(data);
  }
}
