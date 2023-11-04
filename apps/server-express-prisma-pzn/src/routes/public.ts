import express from 'express';
import { registerController, loginController } from '../controller/users';
import { getArticleController } from '../controller/article';


const publicRouter = express.Router();
publicRouter.post('/api/users', registerController);
publicRouter.post('/api/users/login', loginController);

publicRouter.get('/api/article/:slug', getArticleController)


export { publicRouter };
