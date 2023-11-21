import { UserUpdateInputType } from 'validator';
import pool from '../../../app/db';

const updateUser = async (data: Partial<UserUpdateInputType>, id: number) => {
  const inputData = Object.keys(data)
    .map((key, index) => {
      return `${key} = $${index + 2}`;
    })
    .join(', ');

  const query = `UPDATE blog_user SET ${inputData} WHERE (id = $1) RETURNING *`;
  const values = [id, ...Object.values(data)];

  return await pool.query(query, values);
};

export default updateUser;
