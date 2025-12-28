const Screen = require('../../models/movie/Screen.model');
const Theatre = require('../../models/movie/Theatre.model');
const Movie = require('../../models/movie/Movie.model');

/**
 * CREATE SCREEN (THEATRE OWNER)
 * Screen ke andar showtimes (movie + time + price)
 */
exports.createScreen = async (req, res) => {
  try {
    const theatre = await Theatre.findOne({ owner: req.user.userId });
    if (!theatre) {
      return res.status(403).json({ message: 'Theatre not found' });
    }

    const {
      screenName,
      totalSeats,
      showtimes, 
      /*
        showtimes: [
          {
            movie: movieId,
            startTime: "2025-01-10T18:00:00",
            endTime: "2025-01-10T21:00:00",
            price: 250
          }
        ]
      */
    } = req.body;

    // validate movies
    if (showtimes && showtimes.length) {
      for (const show of showtimes) {
        const movie = await Movie.findById(show.movie);
        if (!movie || !movie.isActive) {
          return res.status(400).json({ message: 'Invalid movie in showtime' });
        }
      }
    }

    const screen = await Screen.create({
      theatre: theatre._id,
      screenName,
      totalSeats,
      availableSeats: totalSeats,
      showtimes: showtimes || [],
      isActive: true,
    });

    res.status(201).json({
      message: 'Screen created successfully',
      screen,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADD SHOWTIME (THEATRE OWNER)
 */
exports.addShowtime = async (req, res) => {
  try {
    const theatre = await Theatre.findOne({ owner: req.user.userId });
    if (!theatre) {
      return res.status(403).json({ message: 'Theatre not found' });
    }

    const { movie, startTime, endTime, price } = req.body;

    const movieData = await Movie.findById(movie);
    if (!movieData || !movieData.isActive) {
      return res.status(400).json({ message: 'Invalid movie' });
    }

    const screen = await Screen.findOne({
      _id: req.params.id,
      theatre: theatre._id,
    });

    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    screen.showtimes.push({
      movie,
      startTime,
      endTime,
      price,
    });

    await screen.save();

    res.json({
      message: 'Showtime added successfully',
      screen,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SCREENS BY THEATRE (PUBLIC)
 */
exports.getScreensByTheatre = async (req, res) => {
  try {
    const screens = await Screen.find({
      theatre: req.params.theatreId,
      isActive: true,
    }).populate('showtimes.movie', 'title language');

    res.json(screens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SCREEN BY ID (PUBLIC)
 */
exports.getScreenById = async (req, res) => {
  try {
    const screen = await Screen.findById(req.params.id).populate(
      'showtimes.movie',
      'title language'
    );

    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    res.json(screen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE SCREEN (THEATRE OWNER)
 */
exports.updateScreen = async (req, res) => {
  try {
    const theatre = await Theatre.findOne({ owner: req.user.userId });
    if (!theatre) {
      return res.status(403).json({ message: 'Theatre not found' });
    }

    const allowedFields = ['screenName', 'totalSeats'];
    const updateData = {};

    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    if (updateData.totalSeats !== undefined) {
      updateData.availableSeats = updateData.totalSeats;
    }

    const screen = await Screen.findOneAndUpdate(
      { _id: req.params.id, theatre: theatre._id },
      updateData,
      { new: true }
    );

    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    res.json({
      message: 'Screen updated successfully',
      screen,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE SCREEN (THEATRE OWNER)
 */
exports.toggleScreenStatus = async (req, res) => {
  try {
    const theatre = await Theatre.findOne({ owner: req.user.userId });
    if (!theatre) {
      return res.status(403).json({ message: 'Theatre not found' });
    }

    const screen = await Screen.findOne({
      _id: req.params.id,
      theatre: theatre._id,
    });

    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    screen.isActive = !screen.isActive;
    await screen.save();

    res.json({
      message: `Screen ${
        screen.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
