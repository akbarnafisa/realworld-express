import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProfileWithRelationEntity } from './entities/profile.entity';

@Injectable()
export class ProfileRepository {
  constructor(private prisma: PrismaService) {}

  async getProfileByUsername(
    userId: number | undefined,
    username: string,
  ): Promise<ProfileWithRelationEntity> {
    let following = false;

    if (userId) {
      const getFollowerUser = await this.prisma.user
        .findUnique({
          where: { username },
        })
        .followedBy({
          select: {
            followerId: true,
          },
          where: {
            followerId: userId,
          },
        });

      following = !!getFollowerUser?.length;
    }

    const data = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    return {
      data,
      following,
    };
  }

  async followProfile(userId: number, followingUserId: number) {
    return this.prisma.user
      .update({
        where: {
          id: followingUserId,
        },
        data: {
          followedBy: {
            connectOrCreate: {
              where: {
                followerId_followingId: {
                  followerId: userId,
                  followingId: followingUserId,
                },
              },
              create: { followerId: userId },
            },
          },
        },
      })
      .then(
        () => {},
        () => {},
      );
  }

  async unFollowProfile(userId: number, followingUserId: number) {
    return this.prisma.user
      .update({
        where: {
          id: followingUserId,
        },
        data: {
          followedBy: {
            delete: {
              followerId_followingId: {
                followerId: userId,
                followingId: followingUserId,
              },
            },
          },
        },
      })
      .then(
        () => {},
        () => {},
      );
  }
}
