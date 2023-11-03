import express from 'express';
import { getUserController } from '../controller/user';
import { authenticate } from '../middleware/authMiddleware';

const privateRouter = express.Router();

privateRouter.use(authenticate);
privateRouter.get('/api/user/current', getUserController);

export { privateRouter };
