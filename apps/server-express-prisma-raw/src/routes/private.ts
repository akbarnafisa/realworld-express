import express from 'express';
import { userGet, userUpdate } from '../controller/userController';
import { articleCreate } from '../controller/articleController';

import { authenticate } from '../middleware/authMiddleware';
const routes = express.Router();

// user
routes.get('/api/user', authenticate, userGet);
routes.patch('/api/user', authenticate, userUpdate);

// articleCreate
routes.post('/api/article', authenticate, articleCreate);

export default routes;
