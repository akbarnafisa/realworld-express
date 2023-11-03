// import createUserToken from "../../utils/auth/createUserToken";
// import userCreatePrisma from "../../utils/db/user/userCreatePrisma";
// import { hashPassword } from "../../utils/hashPasswords";
// import userViewer from "../../view/userViewer";

// /**
//  * Users controller that registers the user with information given in the body of the request.
//  * @param req Request
//  * @param res Response
//  * @param next NextFunction
//  * @returns
//  */
// export default async function usersRegister(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { email, password, username } = req.body.user;
//   try {
//     // Hash password
//     const hashed = hashPassword(password);

//     // Create the new user on the database
//     const user = await userCreatePrisma(username, email, hashed);

//     // Create the authentication token for future use
//     const token = createUserToken(user);

//     // Create the user view with the authentication token
//     const userView = userViewer(user, token);

//     return res.status(201).json(userView);
//   } catch (error) {
//     return next(error);
//   }
// }

import { Prisma } from '@prisma/client';
import type { RequestHandler } from 'express';
import { validate, usersRegisterInputSchema, ResponseError, UserRegisterInputType, userViewer } from 'validator';
import userCreatePrisma from '../../utils/db/user/userCreatePrisma';
import hashPassword from '../../utils/hashPassword';
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
