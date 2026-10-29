require('dotenv').config({ quiet: true });

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
};

module.exports = {
  development: { ...base, database: process.env.DB_NAME },
  test: { ...base, database: process.env.DB_NAME_TEST },
  production: { ...base, database: process.env.DB_NAME },
};
