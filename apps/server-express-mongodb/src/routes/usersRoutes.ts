// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/usersController');
// const verifyJWT = require('../middleware/verifyJWT');

// // Authentication
// router.post('/users/login', userController.userLogin);

// // Registration
// router.post('/users', userController.registerUser);

// // Get Current User
// router.get('/user', verifyJWT, userController.getCurrentUser);

// // Update User
// router.put('/user', verifyJWT, userController.updateUser);

// module.exports = router;

import { Router } from 'express';
import { registerUser } from '../controller/usersController';
const router = Router();

router.post('/', registerUser);

export default router