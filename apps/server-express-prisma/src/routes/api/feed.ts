import { Router } from 'express';
import { authenticator } from '../../middleware/auth/authenticator';
import { articlesFeed } from '../../controller/articlesController';

const router = Router();

router.get('/', authenticator, articlesFeed);

export default router;
