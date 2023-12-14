import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestCreateUserDto } from './dto/request/request-create-user.dto';
import { CommonPipe } from '@app/common/common.pipe';
import { ResponseUserWithTokenDto } from './dto/response/response-user-with-token.dto';
import { AuthEntities } from '@app/auth/entities/auth.entities';
import { ResponseUserDto } from './dto/response/response-user.dto';
import { AuthGuard } from '@app/auth/auth.guard';
import { RequestLoginUserDto } from './dto/request/request-login-user.dto';
import { RequestUserUpdateDto } from './dto/request/request-update-user.dto';

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

  @UseGuards(AuthGuard)
  @Patch('user')
  @UsePipes(new CommonPipe())
  async update(
    @Request() req,
    @Body('user') updateUserDto: RequestUserUpdateDto,
  ): Promise<ResponseUserDto> {
    const auth = req.auth as AuthEntities;
    return await this.userService.updateUser(auth, updateUserDto);
  }
}
