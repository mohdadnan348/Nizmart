const express = require('express');
const router = express.Router();

const hotelBookingController = require('../../controllers/hotel/hotelBooking.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create booking (user)
router.post('/', authMiddleware, hotelBookingController.createHotelBooking);

// get my bookings (user)
router.get('/my', authMiddleware, hotelBookingController.getMyHotelBookings);

// get hotel bookings (owner)
router.get(
  '/hotel',
  authMiddleware,
  hotelBookingController.getHotelBookings
);

// update booking status (hotel owner/admin)
router.patch(
  '/:id/status',
  authMiddleware,
  hotelBookingController.updateBookingStatus
);

module.exports = router;
