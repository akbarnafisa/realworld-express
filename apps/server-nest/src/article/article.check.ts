import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArticleRepository } from './article.repository';

@Injectable()
export class ArticleCheck {
  constructor(private articleRepository: ArticleRepository) {}

  checkArticleExist<T>(data: T): NonNullable<T> {
    if (!data) {
      throw new HttpException('Article not found!', HttpStatus.NOT_FOUND);
    }

    return data as NonNullable<T>;
  }

  checkArticleOwner(currentUserId: number, authorId: number | undefined) {
    if (currentUserId !== authorId) {
      throw new HttpException('User unauthorized!', HttpStatus.UNAUTHORIZED);
    }
  }

  async checkExistArticle(slug: string) {
    const data = await this.articleRepository.getArticleBySlug(undefined, slug);
    return this.checkArticleExist(data);
  }
}
