'use strict';

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
   await ReviewImage.bulkCreate([
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
   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('ReviewImages', null, {})
  }
};
