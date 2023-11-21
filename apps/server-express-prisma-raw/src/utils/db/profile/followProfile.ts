import pool from "../../../app/db";

const followProfile = async (followerId: number, followingId: number) => {
  const values = [followerId, followingId];
  return await pool.query('INSERT INTO blog_follows(follower_id, following_id) values($1, $2) RETURNING *', values);
};

export default followProfile;
