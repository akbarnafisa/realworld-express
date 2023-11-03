import express from 'express';
import { registerController, loginController } from '../controller/users';

const publicRouter = express.Router();
publicRouter.post('/api/users', registerController);
publicRouter.post('/api/users/login', loginController);


export { publicRouter };
