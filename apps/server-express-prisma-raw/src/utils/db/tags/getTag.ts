import pool from "../../../app/db"

export const getTag = async (tagName: string) => {
  const query = `SELECT blog_tag.id, blog_tag.name from blog_tag WHERE (blog_tag.name = $1 AND 1=1)`
  const values = [tagName]

  return await pool.query(query, values)
}

export default getTag