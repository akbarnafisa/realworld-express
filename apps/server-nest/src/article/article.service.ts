import { Injectable } from '@nestjs/common';
import { RequestCreateArticleDto } from './dto/request/request-create-article.dto';
import { AuthService } from '@app/auth/auth.service';
import { ArticleRepository } from './article.repository';
import { ArticleWithRelationEntity } from './entities/article.entity';
import { ArticleCheck } from './article.check';

@Injectable()
export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private authService: AuthService,
    private articleCheck: ArticleCheck,
  ) {}
  async create(createArticleDto: RequestCreateArticleDto) {
    const auth = this.authService.getAuthData(true);

    const data = await this.articleRepository.createUser(
      auth.id,
      createArticleDto,
    );

    return this.articleViewer(data);
  }

  async getArticleBySlug(slug: string) {
    const auth = this.authService.getAuthData(false);
    const data = await this.articleRepository.getArticleBySlug(auth?.id, slug);

    if (!data) {
      return this.articleCheck.ArticleNotFoundError();
    }

    return this.articleViewer(data);
  }

  async deleteArticleBySlug(slug: string) {
    const auth = this.authService.getAuthData(true);

    const originArticle = await this.checkExistArticle(slug);
    this.articleCheck.checkArticleOwner(auth.id, originArticle?.authorId);

    await this.articleRepository.deleteArticleBySlug(slug);
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

  private async checkExistArticle(slug: string) {
    const data = await this.articleRepository.getArticleBySlug(undefined, slug);

    if (!data) {
      this.articleCheck.ArticleNotFoundError();
    }

    return data;
  }
}
