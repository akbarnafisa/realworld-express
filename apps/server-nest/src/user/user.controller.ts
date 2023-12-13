import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestCreateUserDto } from './dto/request/request-create-user.dto';
import { CommonPipe } from '@app/common/common.pipe';
import { ResponseUserWithTokenDto } from './dto/response/response-user-with-token.dto';
import { AuthEntities } from '@app/auth/entities/auth.entities';
import { ResponseUserDto } from './dto/response/response-user.dto';
import { AuthGuard } from '@app/auth/auth.guard';
import { RequestLoginUserDto } from './dto/request/request-login-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @UsePipes(new CommonPipe())
  async create(
    @Body('user') createUserDto: RequestCreateUserDto,
  ): Promise<ResponseUserWithTokenDto> {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('user')
  @UsePipes(new CommonPipe())
  async getUserCurrent(@Request() req): Promise<ResponseUserDto> {
    const auth = req.auth as AuthEntities;
    return await this.userService.getCurrentUser(auth);
  }

  @Post('user/login')
  @UsePipes(new CommonPipe())
  async login(
    @Body('user') loginUserDto: RequestLoginUserDto,
  ): Promise<ResponseUserWithTokenDto> {
    return await this.userService.login(loginUserDto);
  }
}
