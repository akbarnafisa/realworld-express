import express from 'express';
import { getUserController, updateUserController } from '../controller/user';
import { getProfileController, followController, unFollowController } from '../controller/profile';
import { createArticleController, deleteArticleController, getArticleController, updateArticleController } from '../controller/article';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware';

const privateRouter = express.Router();

privateRouter.get('/api/user/current', authenticate, getUserController);
privateRouter.patch('/api/user/current', authenticate, updateUserController);

privateRouter.get('/api/user/:username', optionalAuthenticate, getProfileController);
privateRouter.post('/api/user/:username/follow', authenticate, followController);
privateRouter.post('/api/user/:username/unfollow', authenticate, unFollowController);

privateRouter.post('/api/article', authenticate, createArticleController)
privateRouter.delete('/api/article/:slug', authenticate, deleteArticleController)
privateRouter.patch('/api/article/:slug', authenticate, updateArticleController)
privateRouter.delete('/api/article/:slug', optionalAuthenticate, getArticleController)

export { privateRouter };
