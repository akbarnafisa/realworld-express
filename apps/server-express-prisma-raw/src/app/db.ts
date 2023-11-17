import { Pool } from 'pg';
const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'realworld_express_raw',
  password: 'mysecretpassword',
  port: 5432,
});


export default pool

