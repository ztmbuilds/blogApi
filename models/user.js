'use strict';

const bcrypt = require('bcrypt');
const AppError = require('../utils/appError');
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    async correctPassword(candidatePassword, userPassword) {
      return await bcrypt.compare(candidatePassword, userPassword);
    }

    async changedPasswordAfter(JWTTimeStamp) {
      if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
          this.passwordChangedAt.getTime() / 1000,
          10
        );

        return JWTTimeStamp < changedTimeStamp;
      }

      return false;
    }

    static associate(models) {
      // define association here
      this.hasMany(models.Blog, {
        foreignKey: 'owner',
      });
    }
    toJSON() {
      // Each time a res is returned in JSON, thid is executed
      return {
        ...this.get(),
        password: undefined,
        passwordConfirm: undefined,
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
        passwordChangedAt: undefined,
      }; // this.get() gets the fields of the exact object
    }
  }
  User.init(
    {
      uuid: {
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'User must have a name' },
          notEmpty: { msg: 'Name must not be empty' },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'User must have an email' },
          notEmpty: { msg: 'Email must not be empty' },
          isEmail: { msg: 'Must be a valid email address' },
        },
      },
      role: {
        type: DataTypes.ENUM('reader', 'admin', 'writer'),
        allowNull: false,
        defaultValue: 'reader',
        validate: {
          notNull: { msg: 'User must have a role' },
          notEmpty: { msg: 'role must not be empty' },
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: 'password cannot be null' },
          notEmpty: { msg: 'password cannot be empty' },
        },
      },
      passwordConfirm: {
        type: DataTypes.VIRTUAL,
        set(value) {
          if (this.password !== value) {
            throw new AppError(
              'Password and PasswordConfirm must be the same',
              400
            );
          }
          this.setDataValue('passwordConfirm', value);
        },
      },
      passwordResetToken: DataTypes.STRING,
      passwordResetExpires: DataTypes.DATE,
      passwordChangedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'users',
      modelName: 'User',
      hooks: {
        beforeCreate: async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          user.setDataValue('password', hashedPassword);
        },
      },
    }
  );
  return User;
};
