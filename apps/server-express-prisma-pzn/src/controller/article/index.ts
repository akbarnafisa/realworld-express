import { RequestHandler } from 'express';
import {
  createArticleService,
  deleteArticleService,
  getArticleService,
  updateArticleService,
} from '../../service/article';

export const createArticleController: RequestHandler = async (req, res, next) => {
  try {
    const data = await createArticleService(req);
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getArticleController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getArticleService(req);
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteArticleController: RequestHandler = async (req, res, next) => {
  try {
    const data = await deleteArticleService(req);
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateArticleController: RequestHandler = async (req, res, next) => {
  try {
    const data = await updateArticleService(req);
    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};
