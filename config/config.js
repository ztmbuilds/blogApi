require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USERNAME_T,
    password: process.env.DB_PASSWORD_T,
    database: process.env.DB_NAME_T,
    host: process.env.DB_HOST_T || 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
};
