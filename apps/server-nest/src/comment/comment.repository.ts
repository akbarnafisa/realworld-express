import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CommentEntity,
  CommentWithRelationEntity,
} from './entities/comment.entity';
import { ICommentQueryParams } from './comment.interface';

@Injectable()
export class CommentRepository {
  constructor(private prisma: PrismaService) {}

  async createComment({
    body,
    articleId,
    userId,
  }: {
    body: string;
    articleId: number;
    userId: number;
  }): Promise<CommentWithRelationEntity> {
    const data = await this.prisma.comment.create({
      data: {
        body,
        aritcle: {
          connect: {
            id: articleId,
          },
        },
        author: {
          connect: {
            id: userId,
          },
        },
      },
      include: {
        author: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    });

    return data;
  }

  async getComments({
    articleId,
    limit,
    offset,
  }: { articleId: number } & ICommentQueryParams): Promise<{
    data: CommentWithRelationEntity[];
    commentsCount: number;
  }> {
    const data = await this.prisma.comment.findMany({
      where: {
        articleId,
      },
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        author: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    });

    const commentsCount = (
      await this.prisma.comment.findMany({
        where: {
          articleId: articleId,
        },
      })
    ).length;

    return {
      data,
      commentsCount,
    };
  }

  async deleteComments(commentId: number): Promise<CommentEntity> {
    const data = await this.prisma.comment.delete({
      where: { id: commentId },
    });

    return data;
  }

  async getCommentById(commentId: number): Promise<CommentEntity | null> {
    const data = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    return data;
  }
}
