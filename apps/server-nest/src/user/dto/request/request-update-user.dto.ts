import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';

export class RequestUserUpdateDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsOptional()
  @IsUrl()
  image?: string;
}
