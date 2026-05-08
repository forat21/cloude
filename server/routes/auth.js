const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 1 })
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage('Username must contain only letters and numbers'),
    body('email')
      .isEmail()
      .withMessage('Email must be a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  authController.register
);

router.post('/login', authController.login);

module.exports = router;