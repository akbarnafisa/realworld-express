import pool from '../../../app/db';

export const getUserByUsername = async (username: string) => {
  return await pool.query('SELECT * from blog_user WHERE (username = $1) LIMIT 1 OFFSET 0', [username]);
};

export default getUserByUsername;
