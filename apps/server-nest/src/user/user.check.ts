import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UserCheck {
  isUniqueUser(bool: boolean): boolean {
    if (bool) {
      throw new HttpException(
        'Email or username are taken',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return true;
  }

  isExistUser(bool: boolean): boolean {
    if (!bool) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
