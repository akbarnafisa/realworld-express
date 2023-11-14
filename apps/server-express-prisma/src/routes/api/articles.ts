import { Router } from 'express';
import { authenticator, optionalAuthenticator } from '../../middleware/auth/authenticator';
import {
  articlesCreate,
  articlesGet,
  articlesDelete,
  articlesFavorite,
  articlesUnFavorite,
} from '../../controller/articlesController';

const router = Router();

router.post('/', authenticator, articlesCreate);
router.get('/:slug', optionalAuthenticator, articlesGet);
router.delete('/:slug', authenticator, articlesDelete);
router.post('/:slug/favorite', authenticator, articlesFavorite);
router.post('/:slug/unfavorite', authenticator, articlesUnFavorite);

export default router;
