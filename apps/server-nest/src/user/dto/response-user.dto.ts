import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
class ResponseUser {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  bio: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}

export class ResponseUserDto {
  @ValidateNested()
  user: ResponseUser;
}
