import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { YupValidationPipe } from '@app/common/common.pipe';
import { RequestCreateCommentDto } from './dto/request/request-create-article.dto';
import { AuthGuard } from '@app/auth/auth.guard';
import { parseQueryParams } from './comment.helper';
import { ICommentQueryParams } from './comment.interface';

@Controller()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('article/:slug/comment')
  @UseGuards(AuthGuard)
  createComment(
    @Body(YupValidationPipe) createCommentDto: RequestCreateCommentDto,
    @Param('slug') slug: string,
  ) {
    return this.commentService.createComment(slug, createCommentDto);
  }

  @Get('article/:slug/comment')
  @UseGuards(AuthGuard)
  getComments(
    @Param('slug') slug: string,
    @Query() query: ICommentQueryParams,
  ) {
    const params = parseQueryParams(query);
    return this.commentService.getComments(slug, params);
  }

  @Delete('article/:slug/comment/:commentId')
  @UseGuards(AuthGuard)
  deleteCommentById(
    @Param('slug') slug: string,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.deleteCommentById(Number(commentId), slug);
  }
}
