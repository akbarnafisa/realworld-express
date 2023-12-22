import { Injectable } from '@nestjs/common';
import { CommentRepository } from './comment.repository';
import { AuthService } from '@app/auth/auth.service';
import { RequestCreateCommentDto } from './dto/request/request-create-article.dto';
import { ArticleCheck } from '@app/article/article.check';
import { CommentWithRelationEntity } from './entities/comment.entity';
import { CommentResponseType, CommentsResponseType } from 'validator';
import { ICommentQueryRequiredParams } from './comment.interface';
import { CommentCheck } from './comment.check';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private authService: AuthService,
    private articleCheck: ArticleCheck,
    private commentCheck: CommentCheck,
  ) {}

  async createComment(slug: string, createCommentDto: RequestCreateCommentDto) {
    const auth = this.authService.getAuthData(true);

    const originArticle = await this.articleCheck.checkExistArticle(slug);

    const data = await this.commentRepository.createComment({
      body: createCommentDto.body,
      userId: auth.id,
      articleId: originArticle.id,
    });

    return this.commentViewer(data);
  }

  async getComments(slug: string, params: ICommentQueryRequiredParams) {
    const originArticle = await this.articleCheck.checkExistArticle(slug);

    const { commentsCount, data } = await this.commentRepository.getComments({
      articleId: originArticle.id,
      limit: params.limit,
      offset: params.offset,
    });

    return this.commenstViewer(data, {
      commentsCount,
    });
  }

  async deleteCommentById(commentId: number, slug: string) {
    const auth = this.authService.getAuthData(true);

    await this.articleCheck.checkExistArticle(slug);

    const originComment = await this.commentCheck.checkExistComment(commentId);
    this.commentCheck.checkCommentOwner(auth.id, originComment.authorId);

    await this.commentRepository.deleteComments(commentId);
  }

  private commentViewer = (
    comment: CommentWithRelationEntity,
  ): CommentResponseType => {
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

  private commenstViewer = (
    comments: CommentWithRelationEntity[],
    opt: {
      commentsCount: number;
    },
  ): CommentsResponseType => {
    const commentsItem = comments.map((comment) => {
      return this.commentViewer(comment).comment;
    });
    return {
      comments: commentsItem,
      commentsCount: opt.commentsCount,
    };
  };
}
