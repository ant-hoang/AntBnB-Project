// backend/routes/api/session.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation');

const validateReview = [
  check('review')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({min: 4})
    .withMessage('Please provide a valid review.'),
  check('stars')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isNumeric()
    .withMessage('Stars must be an integer from 1 to 5'),
  handleValidationErrors
];

module.exports = { validateReview }