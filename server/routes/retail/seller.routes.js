const express = require('express');
const router = express.Router();
const sellerController = require('../../controllers/retail/seller.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin middleware add kar sakte ho

// register seller (self)
router.post('/register', authMiddleware, sellerController.registerSeller);

// get all sellers (admin)
router.get('/', authMiddleware, sellerController.getAllSellers);

// get seller by id
router.get('/:id', authMiddleware, sellerController.getSellerById);

// update seller profile (self)
router.put(
  '/profile/update',
  authMiddleware,
  sellerController.updateSellerProfile
);

// verify / unverify seller (admin)
router.patch(
  '/:id/toggle-verify',
  authMiddleware,
  sellerController.toggleVerification
);

// activate / deactivate seller (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  sellerController.toggleActiveStatus
);

module.exports = router;
