import type { RequestHandler } from 'express';
import { validate, usersLoginInputSchema, ResponseError, UserLoginInputType, userViewer } from 'validator';
import userGetEmailPrisma from '../../utils/db/user/userGetEmailPrisma';
import { compareWithHash } from '../../utils/hashPassword';
import createUserToken from '../../utils/createUserToken';

const usersLogin: RequestHandler = async (req, res, next) => {
  try {
    const currentUser = await validate<UserLoginInputType>(usersLoginInputSchema, req.body);
    const userInDB = await userGetEmailPrisma(currentUser);

    if (!userInDB) {
      next(new ResponseError(401, 'Email or password is not correct'));
      return;
    }

    const isPasswordCorrect = compareWithHash(currentUser.password, userInDB.password);

    if (!isPasswordCorrect) {
      next(new ResponseError(422, 'Email or password is not correct'));
      return;
    }

    const tokenPayload = {
      id: userInDB.id,
      email: userInDB.email,
      username: userInDB.username,
    };

    return res.status(200).json({
      data: userViewer(userInDB, createUserToken(tokenPayload)),
    });
  } catch (error) {
    next(error);
  }
};

export default usersLogin;
