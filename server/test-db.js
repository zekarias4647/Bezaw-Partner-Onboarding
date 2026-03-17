const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('CONNECTION FAILED:', err.message, 'Code:', err.code, 'Errno:', err.errno);
    process.exit(1);
  } else {
    console.log('CONNECTION SUCCESSFUL');
    process.exit(0);
  }
});
