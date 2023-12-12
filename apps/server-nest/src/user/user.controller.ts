import { Post, Body, UsePipes, Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/userCreate.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { UserRequestCreateDto } from './dto/userRequestCreate.dto';
import { CustomValidationPipe } from 'src/common/common.pipe';
import { ResUserWithTokenDto } from './dto/resUserWithToken.dto';

@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('user')
  @ApiBody({ type: UserRequestCreateDto })
  @ApiCreatedResponse({})
  @UsePipes(new CustomValidationPipe())
  async create(
    @Body('user') createUserDto: UserCreateDto,
  ): Promise<ResUserWithTokenDto> {
    return this.userService.createUser(createUserDto);
  }
}
