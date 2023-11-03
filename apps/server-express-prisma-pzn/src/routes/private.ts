import express from 'express';
import { getUserController, updateUserController } from '../controller/user';
import { authenticate } from '../middleware/authMiddleware';

const privateRouter = express.Router();

privateRouter.use(authenticate);
privateRouter.get('/api/user/current', getUserController);
privateRouter.patch('/api/user/current', updateUserController);

export { privateRouter };
