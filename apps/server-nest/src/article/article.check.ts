import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ArticleCheck {
  ArticleNotFoundError() {
    throw new HttpException('Article not found!', HttpStatus.NOT_FOUND);
  }
}
