const express = require('express');
const router = express.Router();
const serviceBookingController = require('../../controllers/service/serviceBooking.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin / partner middleware add kar sakte ho

// create booking (user)
router.post('/', authMiddleware, serviceBookingController.createBooking);

// get my bookings (user)
router.get('/my', authMiddleware, serviceBookingController.getMyBookings);

// get partner bookings
router.get(
  '/partner',
  authMiddleware,
  serviceBookingController.getPartnerBookings
);

// assign partner (admin)
router.patch(
  '/:id/assign-partner',
  authMiddleware,
  serviceBookingController.assignPartner
);

// update booking status (partner)
router.patch(
  '/:id/status',
  authMiddleware,
  serviceBookingController.updateBookingStatus
);

// cancel booking (user)
router.patch(
  '/:id/cancel',
  authMiddleware,
  serviceBookingController.cancelBooking
);

module.exports = router;
