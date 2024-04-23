'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'passwordResetToken', {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('users', 'passwordResetExpires', {
      type: Sequelize.DATE,
    });

    await queryInterface.addColumn('users', 'passwordChangedAt', {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'passwordResetToken');

    await queryInterface.removeColumn('users', 'passwordResetExpires');

    await queryInterface.removeColumn('users', 'passwordChangedAt');
  },
};
