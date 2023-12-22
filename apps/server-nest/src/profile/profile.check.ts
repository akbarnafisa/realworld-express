import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileCheck {
  constructor(private profileRepository: ProfileRepository) {}
  checkProfileExist<T extends ProfileEntity | null>(data: T): NonNullable<T> {
    if (!data) {
      throw new HttpException('Profile not found!', HttpStatus.NOT_FOUND);
    }

    return data as NonNullable<T>;
  }

  checkUserFollowingStatus(
    userId: number,
    followingUserId: number | undefined,
  ) {
    if (userId !== followingUserId) {
      throw new HttpException(
        'Unable to unfollow or follow yourself',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async checkExistProfile(username: string) {
    const profile = await this.profileRepository.getProfileByUsername(
      undefined,
      username,
    );

    return {
      data: this.checkProfileExist(profile.data),
      following: profile.following,
    };
  }
}
