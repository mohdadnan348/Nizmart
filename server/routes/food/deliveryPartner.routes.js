const express = require('express');
const router = express.Router();
const deliveryPartnerController = require('../../controllers/food/deliveryPartner.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin middleware add kar sakte ho

// register delivery partner (self)
router.post(
  '/register',
  authMiddleware,
  deliveryPartnerController.registerDeliveryPartner
);

// get all delivery partners (admin)
router.get('/', authMiddleware, deliveryPartnerController.getAllDeliveryPartners);

// toggle online/offline (self)
router.patch(
  '/toggle-online',
  authMiddleware,
  deliveryPartnerController.toggleOnlineStatus
);

// activate / deactivate partner (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  deliveryPartnerController.toggleActiveStatus
);

module.exports = router;
