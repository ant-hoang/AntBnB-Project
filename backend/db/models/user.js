'use strict';

const { Model } = require('sequelize');
const { Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    toSafeUser() {
      return {
        id: this.id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        username: this.username
      }
    }

    static associate(models) {
      // define association here
      User.hasMany(models.Spot, {foreignKey: 'ownerId', onDelete: 'CASCADE', hooks: true})
      User.hasMany(models.Booking, {foreignKey: 'userId', onDelete: 'CASCADE', hooks: true})
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [4, 30],
        notEmpty: true,
        notContains: ' ',
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        },
        mustContainLetter(value) {
          const alpha = 'abcdefghijklmnopqrstuvwxyz'
          let hasAlpha = false
          for (let i = 0; i < value.length; i++) {
            if (alpha.includes(value.toLowerCase())) {
              hasAlpha = true
            }
          }
          
          if(!hasAlpha) {
            throw new Error('Username must contain a letter')
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 256],
        isEmail: true,
        notEmpty: true
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlpha: true,
        notContains: ' '
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isAlpha: true,
        notContains: ' '
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [60, 60]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    defaultScope: {
      attributes: {
        exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
      }
    }
  });
  return User;
};