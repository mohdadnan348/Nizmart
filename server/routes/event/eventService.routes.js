const express = require('express');
const router = express.Router();

const eventServiceController = require('../../controllers/event/eventService.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create service (vendor)
router.post('/', authMiddleware, eventServiceController.createEventService);

// get all services (public)
router.get('/', eventServiceController.getAllEventServices);

// get services by vendor (public)
router.get(
  '/vendor/:vendorId',
  eventServiceController.getServicesByVendor
);

// get service by id (public)
router.get('/:id', eventServiceController.getEventServiceById);

// update service (vendor)
router.put('/:id', authMiddleware, eventServiceController.updateEventService);

// activate / deactivate service (vendor)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  eventServiceController.toggleEventServiceStatus
);

module.exports = router;
