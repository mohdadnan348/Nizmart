const express = require('express');
const router = express.Router();

const vendorController = require('../../controllers/event/vendor.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// register vendor (self)
router.post('/register', authMiddleware, vendorController.registerVendor);

// get all vendors (public)
router.get('/', vendorController.getAllVendors);

// get vendor by id (public)
router.get('/:id', vendorController.getVendorById);

// update vendor profile (self)
router.put(
  '/profile/update',
  authMiddleware,
  vendorController.updateVendorProfile
);

// activate / deactivate vendor (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  vendorController.toggleVendorStatus
);

module.exports = router;
