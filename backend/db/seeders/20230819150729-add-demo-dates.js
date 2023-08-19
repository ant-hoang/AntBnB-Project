'use strict';

const { Booking } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Booking.bulkCreate([
      {
        spotId: 5,
        userId: 1,
        startDate: '2023-08-20',
        endDate: '2023-08-25'
      },
      {
        spotId: 6,
        userId: 2,
        startDate: '2023-10-01',
        endDate: '2023-10-10'
      },
      {
        spotId: 7,
        userId: 3,
        startDate: '2023-09-20',
        endDate: '2023-09-25'
      }
    ], { validate: true })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Bookings', null, {});
  }
};
