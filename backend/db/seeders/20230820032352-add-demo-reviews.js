'use strict';

const { Review } = require('../models')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Review.bulkCreate([
      {
        userId: 2,
        spotId: 1,
        review: 'Something Nice',
        stars: 4
      },
      {
        userId: 1,
        spotId: 2,
        review: 'Something wrong',
        stars: 1
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Something average',
        stars: 3
      },
      {
        userId: 2,
        spotId: 3,
        review: 'Blah blah blah',
        stars: 2
      },
      {
        userId: 3,
        spotId: 1,
        review: 'Blah blah blah',
        stars: 2
      },
    ], {validate: true})

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Reviews', null, {});
  }
};
