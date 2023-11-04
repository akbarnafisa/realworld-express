import type { RequestHandler } from 'express';
import { getProfileService, followService, unFollowService } from '../../service/profile';

export const getProfileController: RequestHandler = async (req, res, next) => {
  try {
    const result = await getProfileService(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const followController: RequestHandler = async (req, res, next) => {
  try {
    const result = await followService(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const unFollowController: RequestHandler = async (req, res, next) => {
  try {
    const result = await unFollowService(req);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
