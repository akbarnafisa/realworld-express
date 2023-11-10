import { RequestHandler } from 'express';
import { createCommentService, deleteCommentService, getCommentsService } from '../../service/comment';
import { responseFormat } from 'validator';

export const createCommentController: RequestHandler = async (req, res, next) => {
  try {
    const data = await createCommentService(req);
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

export const getCommentController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getCommentsService(req);
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

export const deleteCommentController: RequestHandler = async (req, res, next) => {
  try {
    await deleteCommentService(req);
    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: null,
      }),
    );
  } catch (error) {
    next(error);
  }
};
