// backend/routes/api/session.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation');

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Street Address is required.'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('City is required.'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('State is required.'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Country is required.'),
  check('lat')
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Latitude is not valid.'),
  check('lng')
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Longitude is not valid.'),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('name is required')
    .isLength({max: 50})
    .withMessage('Name must be less than 50 characters.'),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Description is required.'),
  check('price')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Price per day is required.')
    .isNumeric()
    .withMessage('Price needs to be numeric'),
  handleValidationErrors
];



module.exports = { validateSpot }