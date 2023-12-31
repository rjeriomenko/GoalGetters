const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateGoalInput = [
  check('title')
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 140})
    .withMessage('Title must be between 1 and 140 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .isLength({ min: 1, max: 255 })
    .withMessage('Description must be between 1 and 255 characters'),
  handleValidationErrors
];

module.exports = validateGoalInput;