'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Spot } = require('../models')

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
  options.tableName = 'Spots';
  return queryInterface.bulkInsert(options, [
    {
      ownerId: 1,
      address: "123 Disney Lane",
      city: "San Francisco",
      state: "California",
      country: "United States of America",
      lat: 37.7645358,
      lng: -122.4730327,
      name: "App Academy",
      description: "Place where web developers are created",
      price: 123
    },
    {
      ownerId: 2,
      address: "345 SixFlags Rd",
      city: "Los Angeles",
      state: "California",
      country: "United States of America",
      lat: 122.12345,
      lng: -22.09875,
      name: "Six Flags",
      description: "Warner Bros. Amusement Park",
      price: 200
    },
    {
      ownerId: 3,
      address: "567 GreatAmerica Pkwy",
      city: "New York City",
      state: "New Jersey",
      country: "Canada",
      lat: 420.69802,
      lng: 300.2345,
      name: "Great America Park",
      description: "Nickelodeon Land",
      price: 999
    },
    {
      ownerId: 2,
      address: "123 Disney Lane",
      city: "San Francisco",
      state: "California",
      country: "United States of America",
      lat: 37.7645358,
      lng: -122.4730327,
      name: "App Academy",
      description: "Place where web developers are created",
      price: 123
    }
  ], {})
 
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
