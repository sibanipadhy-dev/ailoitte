const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { signupRules, loginRules } = require('../validation/auth.validations');
const validate = require('../middleware/validation.middleware');

router.post('/signup', signupRules, validate, authController.signup);
router.post('/login', loginRules, validate, authController.login);

module.exports = router;
