import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestCreateUserDto } from './dto/request/request-create-user.dto';
import { RequestValidationPipe, ResponsePipe } from '@app/common/common.pipe';
import { ResponseUserWithTokenDto } from './dto/response/response-user-with-token.dto';
import { ResponseUserDto } from './dto/response/response-user.dto';
import { AuthGuard } from '@app/auth/auth.guard';
import { RequestLoginUserDto } from './dto/request/request-login-user.dto';
import { RequestUserUpdateDto } from './dto/request/request-update-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @UsePipes(new RequestValidationPipe())
  async create(
    @Body('user') createUserDto: RequestCreateUserDto,
  ): Promise<ResponseUserWithTokenDto> {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  @UsePipes(new RequestValidationPipe(), new ResponsePipe())
  async getUserCurrent(): Promise<ResponseUserDto> {
    return await this.userService.getCurrentUser();
  }

  @Post('user/login')
  @UsePipes(new RequestValidationPipe())
  async login(
    @Body('user') loginUserDto: RequestLoginUserDto,
  ): Promise<ResponseUserWithTokenDto> {
    return await this.userService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Patch('user')
  @UsePipes(new RequestValidationPipe())
  async update(
    @Body('user') updateUserDto: RequestUserUpdateDto,
  ): Promise<ResponseUserDto> {
    return await this.userService.updateUser(updateUserDto);
  }
}
