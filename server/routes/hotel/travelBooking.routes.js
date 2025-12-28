const express = require('express');
const router = express.Router();

const travelBookingController = require('../../controllers/hotel/travelBooking.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create travel booking (user)
router.post('/', authMiddleware, travelBookingController.createTravelBooking);

// get my travel bookings (user)
router.get('/my', authMiddleware, travelBookingController.getMyTravelBookings);

// get hotel travel bookings (owner)
router.get(
  '/hotel',
  authMiddleware,
  travelBookingController.getHotelTravelBookings
);

// update travel booking status (hotel/admin)
router.patch(
  '/:id/status',
  authMiddleware,
  travelBookingController.updateTravelBookingStatus
);

module.exports = router;
