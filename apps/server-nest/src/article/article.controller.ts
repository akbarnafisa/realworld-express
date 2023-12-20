import { Controller, Post, Body } from '@nestjs/common';
import { ArticleService } from './article.service';
import { RequestCreateArticleDto } from './dto/request/request-create-article.dto';
import { YupValidationPipe } from '@app/common/common.pipe';

@Controller()
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('article')
  create(@Body(YupValidationPipe) createArticleDto: RequestCreateArticleDto) {
    console.log(createArticleDto);
    return this.articleService.create();
  }

  // @Post('user')
  // @UsePipes(new RequestValidationPipe())
  // async create(
  //   @Body('user') createUserDto: RequestCreateUserDto,
  // ): Promise<ResponseUserWithTokenDto> {
  //   return await this.userService.create(createUserDto);
  // }

  // @Post('/signup')
  // signUp(
  //   @Body(YupValidationPipe)
  //   authCredentialsDto: AuthCredentialsDto,
  // ): Promise<void> {
  //   return this.authService.signUp(authCredentialsDto);
  // }
}
