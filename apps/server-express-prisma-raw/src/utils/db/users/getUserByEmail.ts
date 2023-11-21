import pool from '../../../app/db';

export const getUserByEmail = async (email: string) => {
  return await pool.query('SELECT * from blog_user WHERE (email = $1) LIMIT 1 OFFSET 0', [email]);
};

export default getUserByEmail;
