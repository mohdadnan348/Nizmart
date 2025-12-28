const Movie = require('../../models/movie/Movie.model');

/**
 * CREATE MOVIE (ADMIN / CINEMA OWNER)
 */
exports.createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      language,
      genre,        // array e.g. ['Action','Drama']
      duration,     // minutes
      releaseDate,
      poster,
    } = req.body;

    const movie = await Movie.create({
      title,
      description,
      language,
      genre,
      duration,
      releaseDate,
      poster,
      isActive: true,
    });

    res.status(201).json({
      message: 'Movie created successfully',
      movie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL MOVIES (PUBLIC)
 */
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isActive: true }).sort({
      releaseDate: -1,
    });

    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MOVIE BY ID (PUBLIC)
 */
exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE MOVIE (ADMIN / CINEMA OWNER)
 */
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.json({
      message: 'Movie updated successfully',
      movie,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE MOVIE (ADMIN)
 */
exports.toggleMovieStatus = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.isActive = !movie.isActive;
    await movie.save();

    res.json({
      message: `Movie ${
        movie.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
