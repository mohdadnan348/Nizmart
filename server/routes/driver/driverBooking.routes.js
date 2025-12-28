const express = require('express');
const router = express.Router();

const driverBookingController = require('../../controllers/driver/driverBooking.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create booking (user)
router.post('/', authMiddleware, driverBookingController.createBooking);

// get my bookings (user)
router.get('/my', authMiddleware, driverBookingController.getMyBookings);

// get driver bookings
router.get(
  '/driver',
  authMiddleware,
  driverBookingController.getDriverBookings
);

// update booking status (driver)
router.patch(
  '/:id/status',
  authMiddleware,
  driverBookingController.updateBookingStatus
);

// cancel booking (user)
router.patch(
  '/:id/cancel',
  authMiddleware,
  driverBookingController.cancelBooking
);

module.exports = router;
