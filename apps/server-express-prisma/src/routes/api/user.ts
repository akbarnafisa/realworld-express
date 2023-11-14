import { authenticator, optionalAuthenticator } from '../../middleware/auth/authenticator';
import { userGet, userUpdate } from '../../controller/user';
import { Router } from 'express';
import { followProfile, getProfile, unFollowProfile } from '../../controller/profileController';

const router = Router();

router.get('/', authenticator, userGet);
router.patch('/', authenticator, userUpdate);
// profile
router.get('/:username', optionalAuthenticator, getProfile);
router.post('/:username/follow', authenticator, followProfile);
router.post('/:username/unfollow', authenticator, unFollowProfile);

export default router;
