module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Students', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Students');
  },
};
