const express = require('express');
const router = express.Router();
const servicePartnerController = require('../../controllers/service/servicePartner.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin middleware add kar sakte ho

// register partner (self)
router.post('/register', authMiddleware, servicePartnerController.registerPartner);

// get all partners (admin)
router.get('/', authMiddleware, servicePartnerController.getAllPartners);

// get partner by id
router.get('/:id', authMiddleware, servicePartnerController.getPartnerById);

// update partner profile (self)
router.put(
  '/profile/update',
  authMiddleware,
  servicePartnerController.updatePartnerProfile
);

// toggle online/offline (self)
router.patch(
  '/toggle-online',
  authMiddleware,
  servicePartnerController.toggleOnlineStatus
);

// verify/unverify partner (admin)
router.patch(
  '/:id/toggle-verify',
  authMiddleware,
  servicePartnerController.toggleVerification
);

module.exports = router;
