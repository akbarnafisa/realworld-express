import express from 'express';
import { userGet, userUpdate } from '../controller/userController';
import {
  articleCreate,
  articleDelete,
  articleGet,
  articleFavorite,
  articleUnfavorite,
  articleUpdate,
  articleFeed,
  articlesGet,
} from '../controller/articleController';
import { profileFollow, profileGet, profileUnFollow } from '../controller/profileController';
import { commentCreate, commentDelete, commentsGetService } from '../controller/commentController';


import { authenticate, optionalAuth } from '../middleware/authMiddleware';
const routes = express.Router();

// user
routes.get('/api/user', authenticate, userGet);
routes.patch('/api/user', authenticate, userUpdate);

// articleCreate
routes.post('/api/article', authenticate, articleCreate);
routes.delete('/api/article/:slug', authenticate, articleDelete);
routes.patch('/api/article/:slug', authenticate, articleUpdate);
routes.get('/api/article/:slug', optionalAuth, articleGet);
routes.post('/api/article/:slug/favorite', authenticate, articleFavorite);
routes.post('/api/article/:slug/unfavorite', authenticate, articleUnfavorite);
routes.get('/api/feed', authenticate, articleFeed);
routes.get('/api/articles', optionalAuth, articlesGet);

// comment
routes.get('/api/article/:slug/comments', optionalAuth, commentsGetService);
routes.post('/api/article/:slug/comments', authenticate, commentCreate);
routes.delete('/api/article/:slug/comments/:commentId', authenticate, commentDelete);


// profile
routes.get('/api/user/:username', optionalAuth, profileGet);
routes.post('/api/user/:username/follow', authenticate, profileFollow);
routes.post('/api/user/:username/unfollow', authenticate, profileUnFollow);

export default routes;
