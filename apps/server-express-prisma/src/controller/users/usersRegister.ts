import type { RequestHandler } from 'express';
import {
  validate,
  usersRegisterInputSchema,
  UserRegisterInputType,
  userViewer,
  responseFormat,
} from 'validator';
import userCreatePrisma from '../../utils/db/user/userCreatePrisma';
import { hashPassword } from '../../utils/hashPassword';
import createUserToken from '../../utils/createUserToken';

const usersRegister: RequestHandler = async (req, res, next) => {
  try {
    const user = await validate<UserRegisterInputType>(usersRegisterInputSchema, req.body);

    const { password, ...restInput } = user;

    const createdUser = await userCreatePrisma({
      ...restInput,
      password: hashPassword(password),
    });

    const tokenPayload = {
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
    };

    res.status(200).json(
      responseFormat({
        error: null,
        success: true,
        data: userViewer(createdUser, createUserToken(tokenPayload)),
      }),
    );
  } catch (e) {
    next(e);
  }
};

export default usersRegister;
