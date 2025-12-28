const express = require('express');
const router = express.Router();

const legalBookingController = require('../../controllers/legal/legalBooking.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create booking (user)
router.post('/', authMiddleware, legalBookingController.createLegalBooking);

// get my bookings (user)
router.get('/my', authMiddleware, legalBookingController.getMyLegalBookings);

// get advocate bookings (advocate)
router.get(
  '/advocate',
  authMiddleware,
  legalBookingController.getAdvocateBookings
);

// update booking status (advocate/admin)
router.patch(
  '/:id/status',
  authMiddleware,
  legalBookingController.updateBookingStatus
);

// cancel booking (user)
router.patch(
  '/:id/cancel',
  authMiddleware,
  legalBookingController.cancelBooking
);

module.exports = router;
