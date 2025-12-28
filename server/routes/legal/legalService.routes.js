const express = require('express');
const router = express.Router();

const legalServiceController = require('../../controllers/legal/legalService.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create service (advocate)
router.post('/', authMiddleware, legalServiceController.createLegalService);

// get all services (public)
router.get('/', legalServiceController.getAllLegalServices);

// get services by advocate (public)
router.get(
  '/advocate/:advocateId',
  legalServiceController.getServicesByAdvocate
);

// get service by id (public)
router.get('/:id', legalServiceController.getLegalServiceById);

// update service (advocate)
router.put('/:id', authMiddleware, legalServiceController.updateLegalService);

// activate / deactivate service (advocate)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  legalServiceController.toggleLegalServiceStatus
);

module.exports = router;
