const express = require('express');
const router = express.Router();

const movieBookingController = require('../../controllers/movie/movieBooking.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create booking (user)
router.post('/', authMiddleware, movieBookingController.createMovieBooking);

// get my bookings (user)
router.get('/my', authMiddleware, movieBookingController.getMyMovieBookings);

// get bookings for a screen (theatre owner)
router.get(
  '/screen/:screenId',
  authMiddleware,
  movieBookingController.getScreenBookings
);

// cancel booking (user)
router.patch(
  '/:id/cancel',
  authMiddleware,
  movieBookingController.cancelMovieBooking
);

module.exports = router;
