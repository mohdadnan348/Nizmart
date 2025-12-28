const express = require('express');
const router = express.Router();

const theatreController = require('../../controllers/movie/theatre.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// register theatre (owner)
router.post('/register', authMiddleware, theatreController.registerTheatre);

// get all theatres (public)
router.get('/', theatreController.getAllTheatres);

// get theatre by id (public)
router.get('/:id', theatreController.getTheatreById);

// update theatre (owner)
router.put('/me', authMiddleware, theatreController.updateTheatre);

// activate / deactivate theatre (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  theatreController.toggleTheatreStatus
);

module.exports = router;
