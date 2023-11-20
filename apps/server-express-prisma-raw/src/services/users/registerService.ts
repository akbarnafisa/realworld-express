import type { Request } from 'express';

import { UserRegisterInputType, userViewer, usersRegisterInputSchema, validate } from 'validator';
import { generateToken } from '../../utils/encryption';
import { UserModel } from '../../utils/types';
import { registerUser } from '../../utils/db/users';

const registerService = async (req: Request) => {
  const inputedData = await validate<UserRegisterInputType>(usersRegisterInputSchema, req.body);
  const result = await registerUser(inputedData);
  const data = result.rows[0] as UserModel;

  const token = generateToken({
    email: data.email,
    id: data.id,
    username: data.username,
  });

  return userViewer(data, token);
};

export default registerService;
