import pool from '../../../app/db';

const getProfile = async (currentUserId: number, profileUserId: number) => {
  return await pool.query(
    `
    SELECT blog_user.*, blog_follows.follower_id
    FROM blog_user
        LEFT JOIN blog_follows ON blog_follows.follower_id = $1 AND blog_follows.following_id = $2
    WHERE blog_user.id = $2
  `,
    [currentUserId, profileUserId],
  );
};

export default getProfile;
