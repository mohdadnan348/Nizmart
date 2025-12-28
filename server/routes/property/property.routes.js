const express = require('express');
const router = express.Router();

const propertyController = require('../../controllers/property/property.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create property (owner/agent)
router.post('/', authMiddleware, propertyController.createProperty);

// get all properties (public)
router.get('/', propertyController.getAllProperties);

// get property by id (public)
router.get('/:id', propertyController.getPropertyById);

// get my properties (owner/agent)
router.get('/my/listings', authMiddleware, propertyController.getMyProperties);

// update property (owner/agent)
router.put('/:id', authMiddleware, propertyController.updateProperty);

// activate / deactivate property
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  propertyController.togglePropertyStatus
);

module.exports = router;
