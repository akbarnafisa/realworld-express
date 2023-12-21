import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ArticleService } from './article.service';
import { RequestCreateArticleDto } from './dto/request/request-create-article.dto';
import { YupValidationPipe } from '@app/common/common.pipe';
import { AuthGuard, OptionalAuthGuard } from '@app/auth/auth.guard';
import { ArticleResponseType } from 'validator';

@Controller()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard)
  @Post('article')
  async create(
    @Body(YupValidationPipe) createArticleDto: RequestCreateArticleDto,
  ): Promise<ArticleResponseType> {
    return await this.articleService.create(createArticleDto);
  }

  @UseGuards(OptionalAuthGuard)
  @Get('article/:slug')
  async getUserCurrent(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseType | void> {
    return await this.articleService.getArticleBySlug(slug);
  }
}
