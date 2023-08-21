'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
const { ReviewImage } = require('../models')

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
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: "https://helloworld.com"
      },
      {
        reviewId: 2,
        url: "https://helloworld.com"
      },
      {
        reviewId: 3,
        url: "https://helloworld.com"
      },
      {
        reviewId: 4,
        url: "https://helloworld.com"
      },
      {
        reviewId: 5,
        url: "https://helloworld.com"
      },
      {
        reviewId: 3,
        url: "https://helloworld2.com"
      },
      {
        reviewId: 4,
        url: "https://helloworld2.com"
      },
      {
        reviewId: 1,
        url: "https://helloworld2.com"
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3, 4, 5] }
    }, {});
  }
};
