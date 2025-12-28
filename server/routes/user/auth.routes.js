const express = require('express');
const router = express.Router();
const authController = require('../../controllers/user/auth.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// register
router.post('/register', authController.register);

// login
router.post('/login', authController.login);

// profile (protected)
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
