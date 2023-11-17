import express from 'express';
import { userGet } from '../controller/userController';
import { authenticate } from '../middleware/authMiddleware';
const routes = express.Router();

routes.get('/api/user', authenticate, userGet);

export default routes;
