import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ResponseUserDto } from './response-user.dto';

class ResponseUserWithToken extends ResponseUserDto['user'] {
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ResponseUserWithTokenDto {
  @ValidateNested()
  user: ResponseUserWithToken;
}
