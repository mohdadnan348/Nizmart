const express = require('express');
const router = express.Router();

const hotelController = require('../../controllers/hotel/hotel.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// register hotel (owner)
router.post('/register', authMiddleware, hotelController.registerHotel);

// get all hotels (public)
router.get('/', hotelController.getAllHotels);

// get hotel by id (public)
router.get('/:id', hotelController.getHotelById);

// update hotel (owner)
router.put('/me', authMiddleware, hotelController.updateHotel);

// activate / deactivate hotel (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  hotelController.toggleHotelStatus
);

module.exports = router;
