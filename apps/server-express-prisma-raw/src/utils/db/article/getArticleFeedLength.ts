import pool from '../../../app/db';


const getArticleFeedLength = async (authId: number) => {
  const query = `
    SELECT
      COUNT(*) as total_articles
    FROM blog_article
      JOIN blog_follows ON blog_follows.following_id = blog_article.author_id AND blog_follows.follower_id = $1
  `;

  return await pool.query(query, [authId]);
};

export default getArticleFeedLength