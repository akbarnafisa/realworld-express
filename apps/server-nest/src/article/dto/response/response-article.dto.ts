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
  bio: string | null;

  @IsString()
  @IsNotEmpty()
  image: string | null;
}

export class ResponseUserDto {
  @ValidateNested()
  user: ResponseUser;
}
