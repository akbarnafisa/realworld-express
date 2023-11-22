import pool from '../../../app/db';

export const getCommentById = async (commentId: number) => {
  return await pool.query(`SELECT * from blog_comment WHERE (id = $1) LIMIT 1 OFFSET 0`, [commentId]);
};

export default getCommentById;
