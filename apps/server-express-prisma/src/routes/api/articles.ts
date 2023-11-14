import { Router } from 'express';
import { optionalAuthenticator } from '../../middleware/auth/authenticator';
import { articlesList } from '../../controller/articlesController';

const router = Router();

router.get('/', optionalAuthenticator, articlesList);

export default router;
