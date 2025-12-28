const express = require('express');
const router = express.Router();

const movieController = require('../../controllers/movie/movie.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create movie (admin)
router.post('/', authMiddleware, movieController.createMovie);

// get all movies (public)
router.get('/', movieController.getAllMovies);

// get movie by id (public)
router.get('/:id', movieController.getMovieById);

// update movie (admin)
router.put('/:id', authMiddleware, movieController.updateMovie);

// activate / deactivate movie (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  movieController.toggleMovieStatus
);

module.exports = router;
