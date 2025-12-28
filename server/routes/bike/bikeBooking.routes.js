const express = require('express');
const router = express.Router();

const bikeBookingController = require('../../controllers/bike/bikeBooking.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create booking (user)
router.post('/', authMiddleware, bikeBookingController.createBikeBooking);

// get my bookings (user)
router.get('/my', authMiddleware, bikeBookingController.getMyBikeBookings);

// get owner bookings (owner)
router.get(
  '/owner',
  authMiddleware,
  bikeBookingController.getOwnerBikeBookings
);

// update booking status (owner)
router.patch(
  '/:id/status',
  authMiddleware,
  bikeBookingController.updateBookingStatus
);

// cancel booking (user)
router.patch(
  '/:id/cancel',
  authMiddleware,
  bikeBookingController.cancelBikeBooking
);

module.exports = router;
