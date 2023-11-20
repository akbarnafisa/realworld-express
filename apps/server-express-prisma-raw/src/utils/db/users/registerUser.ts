import { UserRegisterInputType } from 'validator';
import pool from '../../../app/db';
import { hasPassword } from '../../encryption';


export const registerUser = async ({ email, password, username}: UserRegisterInputType) => {
  const values = [email, hasPassword(password), username];
  return await pool.query('INSERT INTO blog_user(email, password, username) values($1, $2, $3) RETURNING *', values);
};

export default registerUser;
