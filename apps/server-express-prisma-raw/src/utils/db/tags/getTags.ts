import pool from '../../../app/db';

export const getTags = async () => {
  const query = `
    SELECT
        blog_tag.id,
        blog_tag.name,
        json_build_object('articles', COUNT(*)) AS _count,
        COUNT(*) AS count
    from blog_tag
        JOIN blog_articles_tags ON blog_articles_tags.tag_id = blog_tag.id
    GROUP BY blog_tag.id
    ORDER BY count DESC
    LIMIT 10
  `;

  return await pool.query(query);
};

export default getTags;
