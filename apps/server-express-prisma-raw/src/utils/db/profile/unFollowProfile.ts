import pool from '../../../app/db';

const unFollowProfile = async (followerId: number, followingId: number) => {
  const query = `DELETE FROM blog_follows WHERE blog_follows.follower_id = $1 AND blog_follows.following_id = $2`;

  return await pool.query(query, [followerId, followingId]);
};

export default unFollowProfile;
