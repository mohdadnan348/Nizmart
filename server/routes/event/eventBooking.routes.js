const express = require('express');
const router = express.Router();

const eventBookingController = require('../../controllers/event/eventBooking.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create booking (user)
router.post('/', authMiddleware, eventBookingController.createEventBooking);

// get my bookings (user)
router.get('/my', authMiddleware, eventBookingController.getMyEventBookings);

// get vendor bookings (vendor)
router.get(
  '/vendor',
  authMiddleware,
  eventBookingController.getVendorEventBookings
);

// update booking status (vendor/admin)
router.patch(
  '/:id/status',
  authMiddleware,
  eventBookingController.updateEventBookingStatus
);

// cancel booking (user)
router.patch(
  '/:id/cancel',
  authMiddleware,
  eventBookingController.cancelEventBooking
);

module.exports = router;
