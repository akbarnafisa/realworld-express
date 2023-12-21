import { Injectable } from '@nestjs/common';
import { RequestCreateArticleDto } from './dto/request/request-create-article.dto';
import { AuthService } from '@app/auth/auth.service';
import { ArticleRepository } from './article.repository';
import { ArticleWithRelationEntity } from './entities/article.entity';
import { ArticleCheck } from './article.check';
import { IArticleQueryRequiredParams } from './article.interface';

@Injectable()
export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private authService: AuthService,
    private articleCheck: ArticleCheck,
  ) {}
  async create(createArticleDto: RequestCreateArticleDto) {
    const auth = this.authService.getAuthData(true);

    const data = await this.articleRepository.createArticle(
      auth.id,
      createArticleDto,
    );

    return this.articleViewer(data);
  }

  async getArticleBySlug(slug: string) {
    const auth = this.authService.getAuthData(false);
    const data = await this.articleRepository.getArticleBySlug(auth?.id, slug);

    const checkedData = this.articleCheck.checkArticleExist(data);

    return this.articleViewer(checkedData);
  }

  async deleteArticleBySlug(slug: string) {
    const auth = this.authService.getAuthData(true);

    const originArticle = await this.checkExistArticle(slug);
    this.articleCheck.checkArticleOwner(auth.id, originArticle?.authorId);

    await this.articleRepository.deleteArticleBySlug(slug);
  }

  async updateArticleBySlug(
    slug: string,
    updateArticleDto: RequestCreateArticleDto,
  ) {
    const auth = this.authService.getAuthData(true);

    const originArticle = await this.checkExistArticle(slug);
    this.articleCheck.checkArticleOwner(auth.id, originArticle?.authorId);

    const data = await this.articleRepository.updateArticle(
      auth.id,
      slug,
      originArticle,
      updateArticleDto,
    );

    return this.articleViewer(data);
  }

  async favoriteArticleBySlug(slug: string) {
    const auth = this.authService.getAuthData(true);

    const originArticle = await this.checkExistArticle(slug);
    this.articleCheck.checkArticleOwner(auth.id, originArticle?.authorId);

    await this.articleRepository.favoriteArticleBySlug(auth.id, slug);
  }

  async unFavoriteArticleBySlug(slug: string) {
    const auth = this.authService.getAuthData(true);

    const originArticle = await this.checkExistArticle(slug);
    this.articleCheck.checkArticleOwner(auth.id, originArticle?.authorId);

    await this.articleRepository.unFavoriteArticleBySlug(
      auth.id,
      originArticle.id,
      slug,
    );
  }

  async getFeedArticle(params: IArticleQueryRequiredParams) {
    const auth = this.authService.getAuthData(true);
    const { data, articlesCount } = await this.articleRepository.getFeedArticle(
      auth.id,
      params,
    );
    return this.articlesViewer(data, {
      articlesCount,
    });
  }

  async getArticles(params: IArticleQueryRequiredParams) {
    const auth = this.authService.getAuthData(false);
    const { data, articlesCount } = await this.articleRepository.getArticles(
      auth?.id,
      params,
    );
    return this.articlesViewer(data, {
      articlesCount,
    });
  }

  private articleViewer(article: ArticleWithRelationEntity) {
    const favoritesCount = article?._count?.favoritedBy || 0;
    const tags = article.tags.map((data) => data.tag.name);
    const favorited = article.favoritedBy
      ? article.favoritedBy.filter((data) => data.userId !== null).length > 0
      : false;
    const author = {
      username: article.author.username,
      image: article.author.image,
      following: article.author.followedBy
        ? article.author.followedBy.filter((data) => data.followerId !== null)
            .length > 0
        : false,
    };

    return {
      article: {
        body: article.body,
        createdAt: article.createdAt,
        description: article.description,
        id: article.id,
        slug: article.slug,
        title: article.title,
        updatedAt: article.updatedAt,
        authorId: article.authorId,
        favoritesCount,
        favorited: favorited || false,
        tags,
        author,
      },
    };
  }

  private articlesViewer(
    articles: ArticleWithRelationEntity[],
    opt: {
      articlesCount: number;
    },
  ) {
    const articlesData = articles.map(
      (article) => this.articleViewer(article).article,
    );

    return {
      articles: articlesData,
      articlesCount: Number(opt.articlesCount),
    };
  }

  private async checkExistArticle(slug: string) {
    const data = await this.articleRepository.getArticleBySlug(undefined, slug);
    return this.articleCheck.checkArticleExist(data);
  }
}
