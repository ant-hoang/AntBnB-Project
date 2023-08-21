'use strict';
const { SpotImage } = require('../models')

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
   await SpotImage.bulkCreate([
    {
      spotId: 1,
      url: 'blah',
      preview: true
    },
    {
      spotId: 2,
      url: 'https://heh.com',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://boogawooga.com',
      preview: true
    },
    {
      spotId: 4,
      url: 'https://halpmeplez.com',
      preview: true
    },
    {
      spotId: 3,
      url: 'https://surely.com',
      preview: false
    }

   ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('SpotImages', null, {});
  }
};
