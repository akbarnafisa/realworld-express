import { Injectable } from '@nestjs/common';
import { AuthService } from '@app/auth/auth.service';
import { ProfileRepository } from './profile.repository';
import { ProfileEntity } from './entities/profile.entity';
import { ProfileResponseType } from 'validator';
import { ProfileCheck } from './profile.check';

@Injectable()
export class ProfileService {
  constructor(
    private profileRepository: ProfileRepository,
    private profileCheck: ProfileCheck,
    private authService: AuthService,
  ) {}
  async getProfileByUsername(username: string) {
    const auth = this.authService.getAuthData(false);

    const dataProfile = await this.profileRepository.getProfileByUsername(
      auth?.id,
      username,
    );

    const checkedData = this.profileCheck.checkProfileExist(dataProfile.data);

    return this.profileViewer(checkedData, dataProfile.following);
  }

  async followProfile(username: string) {
    const auth = this.authService.getAuthData(true);

    const followingUser = await this.profileCheck.checkExistProfile(username);
    this.profileCheck.checkUserFollowingStatus(auth.id, followingUser.data.id);

    await this.profileRepository.followProfile(auth.id, followingUser.data.id);
  }

  async unFollowProfile(username: string) {
    const auth = this.authService.getAuthData(true);

    const followingUser = await this.profileCheck.checkExistProfile(username);
    this.profileCheck.checkUserFollowingStatus(auth.id, followingUser.data.id);

    await this.profileRepository.unFollowProfile(
      auth.id,
      followingUser.data.id,
    );
  }

  private profileViewer(
    data: ProfileEntity,
    following: boolean,
  ): ProfileResponseType {
    return {
      user: {
        following,
        username: data.username,
        bio: data.bio,
        image: data.image,
      },
    };
  }
}
