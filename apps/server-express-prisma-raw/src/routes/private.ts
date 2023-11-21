import express from 'express';
import { userGet, userUpdate } from '../controller/userController';
import { articleCreate, articleDelete, articleGet, articleFavorite, articleUnfavorite  } from '../controller/articleController';

import { authenticate, optionalAuth } from '../middleware/authMiddleware';
const routes = express.Router();

// user
routes.get('/api/user', authenticate, userGet);
routes.patch('/api/user', authenticate, userUpdate);

// articleCreate
routes.post('/api/article', authenticate, articleCreate);
routes.delete('/api/article/:slug', authenticate, articleDelete);
routes.get('/api/article/:slug', optionalAuth, articleGet);
routes.post('/api/article/:slug/favorite', authenticate, articleFavorite);
routes.post('/api/article/:slug/unfavorite', authenticate, articleUnfavorite);


export default routes;
