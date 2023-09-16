// backend/routes/api/session.js
// ...
const { check } = require('express-validator');
const { handleValidationErrors } = require('../validation');

const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email or username is required.'),
  check('password')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Password is required.'),
  handleValidationErrors
];

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .withMessage('Username is required.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  check('firstName')
    .exists({checkFalsey: true})
    .notEmpty()
    .withMessage('First Name is required'),
    check('lastName')
    .exists({checkFalsey: true})
    .notEmpty()
    .withMessage('Last Name is required'),
  handleValidationErrors
];

module.exports = { validateLogin, validateSignup }