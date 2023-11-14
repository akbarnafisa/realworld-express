import { Router } from 'express';
import { authenticator, optionalAuthenticator } from '../../middleware/auth/authenticator';
import {
  articlesCreate,
  articlesGet,
  articlesDelete,
  articlesFavorite,
  articlesUnFavorite,
  articlesUpdate,
} from '../../controller/articlesController';

import { createComment, deleteComment, getComments } from '../../controller/commentsController';

const router = Router();

router.post('/', authenticator, articlesCreate);
router.get('/:slug', optionalAuthenticator, articlesGet);
router.delete('/:slug', authenticator, articlesDelete);
router.patch('/:slug', authenticator, articlesUpdate);
// favorite
router.post('/:slug/favorite', authenticator, articlesFavorite);
router.post('/:slug/unfavorite', authenticator, articlesUnFavorite);
// article comment
router.post('/:slug/comments', authenticator, createComment);
router.delete('/:slug/comments/:commentId', authenticator, deleteComment);
router.get('/:slug/comments', optionalAuthenticator, getComments);

export default router;
