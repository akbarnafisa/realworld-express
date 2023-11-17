import express from 'express';
import { userGet, userUpdate } from '../controller/userController';
import { authenticate } from '../middleware/authMiddleware';
const routes = express.Router();

routes.get('/api/user', authenticate, userGet);
routes.patch('/api/user', authenticate, userUpdate);

export default routes;
