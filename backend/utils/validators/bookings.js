// backend/routes/api/session.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation');

const validateBooking = [
  check('startDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a start date.'),
  check('endDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide an end date.'),
  handleValidationErrors
];

module.exports = { validateBooking }