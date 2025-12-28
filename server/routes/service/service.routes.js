const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/service/service.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin middleware add kar sakte ho

// create service (admin)
router.post('/', authMiddleware, serviceController.createService);

// get all services (public)
router.get('/', serviceController.getAllServices);

// get services by category
router.get(
  '/category/:categoryId',
  serviceController.getServicesByCategory
);

// get service by id
router.get('/:id', serviceController.getServiceById);

// update service (admin)
router.put('/:id', authMiddleware, serviceController.updateService);

// activate / deactivate service (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  serviceController.toggleServiceStatus
);

module.exports = router;
