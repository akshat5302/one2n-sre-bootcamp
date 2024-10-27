const Sequelize = require('sequelize');
const db = require('../utils/database');

const Student = db.define('Students', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
});

module.exports = Student;
