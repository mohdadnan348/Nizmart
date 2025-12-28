const express = require('express');
const router = express.Router();

const screenController = require('../../controllers/movie/screen.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create screen (theatre owner)
router.post('/', authMiddleware, screenController.createScreen);

// add showtime to screen (theatre owner)
router.post(
  '/:id/showtime',
  authMiddleware,
  screenController.addShowtime
);

// get screens by theatre (public)
router.get(
  '/theatre/:theatreId',
  screenController.getScreensByTheatre
);

// get screen by id (public)
router.get('/:id', screenController.getScreenById);

// update screen (theatre owner)
router.put('/:id', authMiddleware, screenController.updateScreen);

// activate / deactivate screen (theatre owner)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  screenController.toggleScreenStatus
);

module.exports = router;
