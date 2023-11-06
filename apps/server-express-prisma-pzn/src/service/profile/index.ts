import { Request } from 'express-jwt';
import { ResponseError, TokenPayload, profileViewer } from 'validator';
import { prismaClient } from '../../application/database';
import { Prisma } from '@prisma/client';

export const getProfileService = async (request: Request) => {
  const { username } = request.params;
  const auth = request?.auth as TokenPayload | undefined;
  let following = false;

  if (auth) {
    const getFollowerUser = await prismaClient.user
      .findUnique({
        where: { username },
      })
      .followedBy({
        select: {
          followerId: true,
        },
        where: {
          followerId: auth?.id,
        },
      });

    following = !!getFollowerUser?.length;
  }

  const userProfile = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });

  if (!userProfile) {
    throw new ResponseError(404, 'User not found!');
  }

  return profileViewer(userProfile, {
    following,
  });
};

export const followService = async (request: Request) => {
  const { username } = request.params;
  const auth = request?.auth as TokenPayload | undefined;

  const followingUser = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });

  if (!followingUser) {
    throw new ResponseError(404, 'User not found!');
  }

  try {
    if (!auth || !auth.id) {
      throw new ResponseError(401, 'User unauthenticated!');
    }

    if (followingUser.id === auth.id) {
      throw new ResponseError(422, 'Unable to follow yourself');
    }

    await prismaClient.user.update({
      where: {
        id: followingUser.id,
      },
      data: {
        followedBy: {
          connectOrCreate: {
            where: {
              followerId_followingId: {
                followerId: auth.id,
                followingId: followingUser.id,
              },
            },
            create: { followerId: auth.id },
          },
        },
      },
    });

    return {
      success: true,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2017') {
        throw new ResponseError(422, 'User unauthenticated!');
      }
    }
  }
};

export const unFollowService = async (request: Request) => {
  const { username } = request.params;
  const auth = request?.auth as TokenPayload | undefined;

  const followingUser = await checkProfile(username);

  if (!followingUser) {
    throw new ResponseError(404, 'User not found!');
  }

  try {
    if (!auth || !auth.id) {
      throw new ResponseError(401, 'User unauthenticated!');
    }

    if (followingUser.id === auth.id) {
      throw new ResponseError(422, 'Unable to unfollow yourself');
    }

    await prismaClient.user.update({
      where: {
        id: followingUser.id,
      },
      data: {
        followedBy: {
          delete: {
            followerId_followingId: {
              followerId: auth.id,
              followingId: followingUser.id,
            },
          },
        },
      },
    });

    return {
      success: true,
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2017') {
        throw new ResponseError(422, 'User already unfollowed');
      }
    }
  }
};

const checkProfile = async (username: string) => {
  return await prismaClient.user.findUnique({
    where: {
      username,
    },
  });
};
