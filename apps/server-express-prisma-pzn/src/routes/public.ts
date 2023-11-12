import express from 'express';
import { registerController, loginController } from '../controller/users';
import { getTagsController } from '../controller/tags';



const publicRouter = express.Router();
publicRouter.post('/api/users', registerController);
publicRouter.post('/api/users/login', loginController);
publicRouter.get('/api/tags', getTagsController);

export { publicRouter };
