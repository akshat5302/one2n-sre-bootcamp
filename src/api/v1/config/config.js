require('dotenv').config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER || 'akshat',
    password: process.env.POSTGRES_PASSWORD || '12345',
    database: process.env.POSTGRES_DB || 'student_db',
    host: process.env.POSTGRES_HOST || 'student-db',
    dialect: 'postgres',
  },

};