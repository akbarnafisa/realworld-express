import { ApiProperty } from '@nestjs/swagger';
import { UserWithTokenDto } from './userWithToken.dto';
import { ValidateNested } from 'class-validator';

export class ResUserWithTokenDto {
  @ApiProperty({ type: UserWithTokenDto })
  @ValidateNested()
  user: UserWithTokenDto;
}
