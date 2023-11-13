import { authenticator } from '../../middleware/auth/authenticator';
import { userGet, userUpdate } from '../../controller/user';
import { Router } from 'express';

const router = Router();

router.get('/', authenticator, userGet);
router.patch('/', authenticator, userUpdate);

export default router;
