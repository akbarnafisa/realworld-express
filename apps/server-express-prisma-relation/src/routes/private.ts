import express from 'express';
import { getUserController, updateUserController } from '../controller/user';
import { getProfileController, followController, unFollowController } from '../controller/profile';
import {
  createArticleController,
  deleteArticleController,
  updateArticleController,
  favoriteArticleController,
  unFavoriteArticleController,
  getArticleController,
  getFeedController,
  getArticlesController,
} from '../controller/article';
import { createCommentController, deleteCommentController, getCommentController } from '../controller/comment';

import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware';

const privateRouter = express.Router();

// user
privateRouter.get('/api/user', authenticate, getUserController);
privateRouter.patch('/api/user', authenticate, updateUserController);
// profie
privateRouter.get('/api/user/:username', optionalAuthenticate, getProfileController);
privateRouter.post('/api/user/:username/follow', authenticate, followController);
privateRouter.post('/api/user/:username/unfollow', authenticate, unFollowController);

// article
privateRouter.post('/api/article', authenticate, createArticleController);
privateRouter.delete('/api/article/:slug', authenticate, deleteArticleController);
privateRouter.patch('/api/article/:slug', authenticate, updateArticleController);
privateRouter.get('/api/article/:slug', optionalAuthenticate, getArticleController)
privateRouter.get('/api/feed', authenticate, getFeedController)
privateRouter.get('/api/articles', optionalAuthenticate, getArticlesController);

// article favorite
privateRouter.post('/api/article/:slug/favorite', authenticate, favoriteArticleController);
privateRouter.post('/api/article/:slug/unfavorite', authenticate, unFavoriteArticleController);
// article comment
privateRouter.post('/api/article/:slug/comments', authenticate, createCommentController);
privateRouter.delete('/api/article/:slug/comments/:commentId', authenticate, deleteCommentController);
privateRouter.get('/api/article/:slug/comments', optionalAuthenticate, getCommentController)

export { privateRouter };
