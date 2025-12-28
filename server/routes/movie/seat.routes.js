const express = require('express');
const router = express.Router();

const seatController = require('../../controllers/movie/seat.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create seat layout (theatre owner)
router.post('/', authMiddleware, seatController.createSeatLayout);

// get seat layout by screen (public)
router.get(
  '/screen/:screenId',
  seatController.getSeatsByScreen
);

// get available seats (public)
router.get(
  '/screen/:screenId/available',
  seatController.getAvailableSeats
);

// lock seats (user)
router.post(
  '/screen/:screenId/lock',
  authMiddleware,
  seatController.lockSeats
);

// confirm seats (after payment)
router.post(
  '/screen/:screenId/confirm',
  authMiddleware,
  seatController.confirmSeats
);

module.exports = router;
