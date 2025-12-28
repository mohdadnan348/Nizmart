const express = require('express');
const router = express.Router();

const bikeOwnerController = require('../../controllers/bike/bikeOwner.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// register bike owner
router.post('/register', authMiddleware, bikeOwnerController.registerBikeOwner);

// get my profile
router.get('/me', authMiddleware, bikeOwnerController.getMyProfile);

// update my profile
router.put('/me', authMiddleware, bikeOwnerController.updateProfile);

// activate / deactivate owner (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  bikeOwnerController.toggleOwnerStatus
);

module.exports = router;
