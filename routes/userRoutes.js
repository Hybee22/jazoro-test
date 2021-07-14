const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// AUTH ROUTES
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;
