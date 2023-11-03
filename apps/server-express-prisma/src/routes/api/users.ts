import { usersRegister, usersLogin } from '../../controller/users';
import { Router } from 'express';

const router = Router();

router.post('/', usersRegister);
router.post('/login', usersLogin);

export default router;
