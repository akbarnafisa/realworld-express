import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard, OptionalAuthGuard } from '@app/auth/auth.guard';
import { ProfileResponseType } from 'validator';

@Controller()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(OptionalAuthGuard)
  @Get('profile/:username')
  async getProfileByUsername(
    @Param('username') username: string,
  ): Promise<ProfileResponseType> {
    return await this.profileService.getProfileByUsername(username);
  }

  @UseGuards(AuthGuard)
  @Post('profile/:username/follow')
  async followProfile(@Param('username') username: string) {
    await this.profileService.followProfile(username);
    return null;
  }

  @UseGuards(AuthGuard)
  @Post('profile/:username/unfollow')
  async unFollowProfile(@Param('username') username: string) {
    await this.profileService.unFollowProfile(username);
    return null;
  }
}
