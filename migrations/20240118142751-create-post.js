'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
    
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'title cannot be null',
          },
          notEmpty: {
            mdg: 'title cannot be empty',
          },
        },
      },
      body: {
        type: Sequelize.STRING,
        allowNull: false,
      },
     blogId:{
       type:Sequelize.UUID,
       allowNull:false
     },
     state:{
       type: Sequelize.ENUM('draft', 'published'),
       defaultValue:'draft'
     },
     readCount:{
       type: Sequelize.INTEGER
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  },
};
