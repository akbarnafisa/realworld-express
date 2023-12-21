import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ArticleCheck {
  ArticleNotFoundError() {
    throw new HttpException('Article not found!', HttpStatus.NOT_FOUND);
  }

  checkArticleOwner(currentUserId: number, authorId: number | undefined) {
    if (currentUserId !== authorId) {
      throw new HttpException('User unauthorized!', HttpStatus.UNAUTHORIZED);
    }
  }
}
