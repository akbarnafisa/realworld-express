import { RequestHandler } from 'express';
import {
  createArticleService,
  deleteArticleService,
  getArticleService,
  updateArticleService,
  favoriteArticleService,
  unFavoriteArticleService,
  getArticlesService,
  getFeedService,
} from '../../service/article';
import { responseFormat } from 'validator';

export const createArticleController: RequestHandler = async (req, res, next) => {
  try {
    const data = await createArticleService(req);
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

export const getArticleController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getArticleService(req);
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

export const getArticlesController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getArticlesService(req);
    console.log('asoi', data)
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

export const getFeedController: RequestHandler = async (req, res, next) => {
  try {
    const data = await getFeedService(req);
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

export const deleteArticleController: RequestHandler = async (req, res, next) => {
  try {
    await deleteArticleService(req);
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

export const updateArticleController: RequestHandler = async (req, res, next) => {
  try {
    const data = await updateArticleService(req);
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

export const favoriteArticleController: RequestHandler = async (req, res, next) => {
  try {
    const data = await favoriteArticleService(req);
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

export const unFavoriteArticleController: RequestHandler = async (req, res, next) => {
  try {
    const data = await unFavoriteArticleService(req);
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
