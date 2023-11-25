import pool from '../../../app/db';
import { ArticlesQueries, getWhereData } from './getArticles';

const getArticlesLength = async (queries: ArticlesQueries) => {
  const { whereValues, whereQueries } = getWhereData(queries, 1);

  const query = `
    SELECT
      COUNT(DISTINCT blog_article.id) as total_articles
    FROM blog_article
      LEFT JOIN blog_favorites ON blog_favorites.article_id = blog_article.id
      LEFT JOIN blog_user AS favorited_query ON favorited_query.id = blog_favorites.author_id
      JOIN blog_articles_tags ON blog_articles_tags.article_id = blog_article.id
      JOIN blog_tag ON blog_articles_tags.tag_id = blog_tag.id
    ${whereValues.length ? `WHERE ${whereQueries}` : ''}
  `;

  const values = [...whereValues];

  return await pool.query(query, values);
};

export default getArticlesLength;
