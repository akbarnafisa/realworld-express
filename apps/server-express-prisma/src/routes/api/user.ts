// import { Router } from "express";
// import { userGet, userUpdate } from "../../controllers/userController";

// import { userUpdateValidator } from "../../middleware/userValidator";

// const router = Router();

// router.get("/", authenticate, userGet);

// router.put("/", authenticate, userUpdateValidator, userUpdate);

// export default router;

import authenticator from "../../middleware/auth/authenticator";
import { userGet, userUpdate } from '../../controller/user';
import { Router } from 'express';

const router = Router();

router.get('/current', authenticator, userGet);
router.patch('/current', authenticator, userUpdate);

export default router;
