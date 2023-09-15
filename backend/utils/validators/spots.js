// backend/routes/api/session.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation');

const validateQuery = [
  check('page')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Page must be greater than or equal to 1"),
  check('size')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Size must be greater than or equal to 1"),
  check('maxLat')
    .optional()
    .isDecimal()
    .withMessage("Maximum latitude is invalid"),
  check('minLat')
    .optional()
    .isDecimal()
    .withMessage("Minimum latitude is invalid"),
  check('minLng')
    .optional()
    .isDecimal()
    .withMessage("Minimum longitude is invalid"),
  check('maxLng')
    .optional()
    .isDecimal()
    .withMessage("Maximum longitude is invalid"),
  check('minPrice')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check('maxPrice')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors
]

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
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters.'),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Description is required.'),
  check('price')
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage('Price per day is required.'),
  handleValidationErrors
];



module.exports = { validateQuery, validateSpot }