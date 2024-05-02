'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs', {
      uuid: {
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.STRING,
      },
      owner: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'uuid',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('blogs', {
      fields: ['owner'],
      type: 'foreign key',
      name: 'FK_Blog_User',
      references: {
        table: 'users',
        field: 'uuid',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('blogs', 'FK_Blog_User');
    await queryInterface.dropTable('blogs');
  },
};
