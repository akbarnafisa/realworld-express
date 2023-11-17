import express from 'express';
import { usersRegister, usersLogin } from '../controller/usersController';

const routes = express.Router();

routes.post('/api/users', usersRegister);
routes.post('/api/users/login', usersLogin);

export default routes;
