const { body } = require('express-validator');

const signupRules = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password too short'),
];

const loginRules = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').exists().withMessage('Password required'),
];

module.exports = { signupRules, loginRules };
