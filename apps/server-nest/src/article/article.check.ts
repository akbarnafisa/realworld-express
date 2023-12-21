import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ArticleCheck {
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
}
