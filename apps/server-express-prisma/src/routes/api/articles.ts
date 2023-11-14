import { Router } from 'express';
import { authenticator, optionalAuthenticator } from '../../middleware/auth/authenticator';
import { articlesCreate, articlesGet } from '../../controller/articlesController';

const router = Router();

router.post('/', authenticator, articlesCreate);
router.get('/:slug', optionalAuthenticator, articlesGet);

export default router;
