const express = require('express');
const router = express.Router();

const propertyOwnerController = require('../../controllers/property/propertyOwner.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// register owner / agent (self)
router.post('/register', authMiddleware, propertyOwnerController.registerOwner);

// get my profile (self)
router.get('/me', authMiddleware, propertyOwnerController.getMyProfile);

// get all owners / agents (public/admin)
router.get('/', propertyOwnerController.getAllOwners);

// update my profile (self)
router.put('/me', authMiddleware, propertyOwnerController.updateOwnerProfile);

// activate / deactivate owner (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  propertyOwnerController.toggleOwnerStatus
);

module.exports = router;
