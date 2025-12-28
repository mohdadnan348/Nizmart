const express = require('express');
const router = express.Router();

const driverController = require('../../controllers/driver/driver.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// register driver
router.post('/register', authMiddleware, driverController.registerDriver);

// list drivers (public)
router.get('/', driverController.getAllDrivers);

// get my profile
router.get('/me', authMiddleware, driverController.getMyProfile);

// update profile
router.put('/me', authMiddleware, driverController.updateProfile);

// toggle availability
router.patch(
  '/me/toggle-availability',
  authMiddleware,
  driverController.toggleAvailability
);

module.exports = router;
