import express from 'express';
import { usersRegister, usersLogin } from '../controller/usersController';

import { tagsGet } from '../controller/tagController';


const routes = express.Router();

routes.post('/api/users', usersRegister);
routes.post('/api/users/login', usersLogin);

routes.get('/api/tags', tagsGet);

export default routes;
