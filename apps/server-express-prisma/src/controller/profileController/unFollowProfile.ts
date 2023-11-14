import type { RequestHandler } from 'express';
import { responseFormat, TokenPayload, ResponseError } from 'validator';
import prisma from '../../utils/db/prisma';
import userUnFollowProfilePrisma from '../../utils/db/user/userUnFollowProfilePrisma';

const unFollowProfile: RequestHandler = async (request, res, next) => {
  try {
    const { username } = request.params;
    const auth = request?.auth as TokenPayload | undefined;

    if (!auth || !auth.id) {
      throw new ResponseError(401, 'User unauthenticated!');
    }

    const followingUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!followingUser) {
      throw new ResponseError(404, 'User not found!');
    }

    if (followingUser.id === auth.id) {
      throw new ResponseError(422, 'Unable to unfollow yourself');
    }

    await userUnFollowProfilePrisma(followingUser.id, auth.id);

    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: {
          success: true,
        },
      }),
    );
  } catch (e) {
    next(e);
  }
};

export default unFollowProfile;
