import type { RequestHandler } from 'express';
import { getProfileService, followService, unFollowService } from '../../service/profile';
import { responseFormat } from 'validator';

export const getProfileController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getProfileService(req);
    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const followController: RequestHandler = async (req, res, next) => {
  try {
    const data = await followService(req);
    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const unFollowController: RequestHandler = async (req, res, next) => {
  try {
    const data = await unFollowService(req);
    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data,
      }),
    );
  } catch (error) {
    next(error);
  }
};
