'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Blog, {
        foreignKey: 'blogId',
        as: 'blog',
      });
    }

    toJSON() {
      return { ...this.get(), id: undefined, userId: undefined };
    }
  }
  Post.init(
    {
      uuid: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
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
        type: DataTypes.STRING,
        allowNull: false,
      },
      blogId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM('draft', 'published'),
        defaultValue: 'draft',
      },
      readCount: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      tableName: 'posts',
      modelName: 'Post',
    }
  );
  return Post;
};
