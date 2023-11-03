import { RequestHandler } from 'express';
import { validate, usersRegisterInputSchema, UserRegisterInputType } from 'validator';
import bcrypt from 'bcrypt';
import User from '../models/User';

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await validate<UserRegisterInputType>(usersRegisterInputSchema, req.body);
    const { password, ...inputRest } = user;

    const createdUser = await User.create({
      ...inputRest,
      password: bcrypt.hashSync(password, 10),
    });

    if (createdUser) {
      return res.status(201).json({
        data: createdUser.toJSON(),
      });
    } else {
      res.status(422).json({
        errors: {
          body: 'Unable to register a user',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};
