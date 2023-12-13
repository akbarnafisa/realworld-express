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
import { CreateUserDto } from './dto/create-user.dto';
import { CommonPipe } from '@app/common/common.pipe';
import { ResponseUserWithTokenDto } from './dto/response-user-with-token.dto';
import { AuthEntities } from '@app/auth/entities/auth.entities';
import { ResponseUserDto } from './dto/response-user.dto';
import { AuthGuard } from '@app/auth/auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @UsePipes(new CommonPipe())
  async create(
    @Body('user') createUserDto: CreateUserDto,
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
}
