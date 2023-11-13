import { Router } from 'express';
import { authenticator } from '../../middleware/auth/authenticator';
import { articlesCreate } from '../../controller/articlesController';

const router = Router();

router.post('/', authenticator, articlesCreate);

export default router;
