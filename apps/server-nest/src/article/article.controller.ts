import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { RequestCreateArticleDto } from './dto/request/request-create-article.dto';
import { YupValidationPipe } from '@app/common/common.pipe';
import { AuthGuard, OptionalAuthGuard } from '@app/auth/auth.guard';
import { ArticleResponseType, ArticlesResponseType } from 'validator';
import { IArtilceQueryParams } from './article.interface';
import { parseQueryParams } from './article.helper';

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
  async getArticleBySlug(
    @Param('slug') slug: string,
  ): Promise<ArticleResponseType> {
    return await this.articleService.getArticleBySlug(slug);
  }

  @UseGuards(AuthGuard)
  @Delete('article/:slug')
  async deleteArticleBySlug(@Param('slug') slug: string) {
    await this.articleService.deleteArticleBySlug(slug);
    return null;
  }

  @UseGuards(AuthGuard)
  @Put('article/:slug')
  async updaterticleBySlug(
    @Param('slug') slug: string,
    @Body(YupValidationPipe) updateArticleDto: RequestCreateArticleDto,
  ) {
    return await this.articleService.updateArticleBySlug(
      slug,
      updateArticleDto,
    );
  }

  @UseGuards(AuthGuard)
  @Post('article/:slug/favorite')
  async favoriteArticle(@Param('slug') slug: string) {
    await this.articleService.favoriteArticleBySlug(slug);
    return null;
  }

  @UseGuards(AuthGuard)
  @Post('article/:slug/unfavorite')
  async unFavoriteArticle(@Param('slug') slug: string) {
    await this.articleService.unFavoriteArticleBySlug(slug);
    return null;
  }

  @UseGuards(AuthGuard)
  @Get('articles/feed')
  async getFeedArticle(
    @Query() query: IArtilceQueryParams,
  ): Promise<ArticlesResponseType> {
    const params = parseQueryParams(query);
    return await this.articleService.getFeedArticle(params);
  }

  @UseGuards(OptionalAuthGuard)
  @Get('articles')
  async getArticles(
    @Query() query: IArtilceQueryParams,
  ): Promise<ArticlesResponseType> {
    const params = parseQueryParams(query);
    return await this.articleService.getArticles(params);
  }
}
