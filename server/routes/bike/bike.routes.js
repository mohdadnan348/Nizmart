const express = require('express');
const router = express.Router();

const bikeController = require('../../controllers/bike/bike.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create bike (owner)
router.post('/', authMiddleware, bikeController.createBike);

// get all bikes (public)
router.get('/', bikeController.getAllBikes);

// get bike by id (public)
router.get('/:id', bikeController.getBikeById);

// get my bikes (owner)
router.get('/my/listings', authMiddleware, bikeController.getMyBikes);

// update bike (owner)
router.put('/:id', authMiddleware, bikeController.updateBike);

// toggle availability (owner)
router.patch(
  '/:id/toggle-availability',
  authMiddleware,
  bikeController.toggleAvailability
);

// activate / deactivate bike
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  bikeController.toggleBikeStatus
);

module.exports = router;
