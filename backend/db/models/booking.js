'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.Spot, {foreignKey: 'spotId'})
      Booking.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  Booking.init({
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        beforeEndDate(value) {
          if (value > this.endDate) throw new Error('cannot book a start before the end')
        },
        afterToday(value) {
          let valueDate = Date.parse(value);
          let currentDate = Date.now();
          if (valueDate < currentDate) throw new Error('cannot book a spot before the present time')
        }
      }
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        afterStartDate(value) {
          if (value < this.startDate) throw new Error('cannot end date before the start')
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};