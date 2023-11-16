import express from 'express';
import { usersRegister } from '../controller/usersController';

const routes = express.Router();

routes.post('/api/users', usersRegister);

export default routes;
