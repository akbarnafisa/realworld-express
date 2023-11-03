import { Prisma } from '@prisma/client';
import type { RequestHandler } from 'express';
import { validate, usersRegisterInputSchema, ResponseError, UserRegisterInputType, userViewer } from 'validator';
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

    return res.status(200).json({
      data: userViewer(createdUser, createUserToken(tokenPayload)),
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        next(new ResponseError(422, 'Username or email had been used', 'BAD_INPUT'));
      }
    } else {
      next(e);
    }
  }
};

export default usersRegister;
