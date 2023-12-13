import { RequestCreateUserDto } from './request-create-user.dto';
import { OmitType } from '@nestjs/swagger';

export class RequestLoginUserDto extends OmitType(RequestCreateUserDto, [
  'username',
]) {}
