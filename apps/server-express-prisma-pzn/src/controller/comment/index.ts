import { RequestHandler } from 'express';
import {
  createCommentService,
  deleteCommentService,
  getCommentsService,
} from '../../service/comment';

export const createCommentController: RequestHandler = async (req, res, next) => {
  try {
    const data = await createCommentService(req);
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getCommentsService(req);
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentController: RequestHandler = async (req, res, next) => {
  try {
    const data = await deleteCommentService(req);
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};
