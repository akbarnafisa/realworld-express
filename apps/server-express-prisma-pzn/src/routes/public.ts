import express from 'express';
import { registerController } from '../controller/users';

const publicRouter = express.Router();
publicRouter.post('/api/users', registerController);

export { publicRouter };
