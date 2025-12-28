const MovieBooking = require('../../models/movie/MovieBooking.model');
const Screen = require('../../models/movie/Screen.model');
const Seat = require('../../models/movie/Seat.model');

/**
 * CREATE MOVIE BOOKING (USER)
 * Requires seats already LOCKED
 */
exports.createMovieBooking = async (req, res) => {
  try {
    const {
      screenId,
      showtimeId,
      seatIds,
      totalAmount,
      paymentId,
    } = req.body;

    const screen = await Screen.findById(screenId);
    if (!screen || !screen.isActive) {
      return res.status(400).json({ message: 'Screen not available' });
    }

    const seatLayout = await Seat.findOne({ screen: screenId });
    if (!seatLayout) {
      return res.status(404).json({ message: 'Seat layout not found' });
    }

    // validate locked seats
    const selectedSeats = seatLayout.seats.filter((s) =>
      seatIds.includes(s._id.toString())
    );

    if (
      selectedSeats.length !== seatIds.length ||
      selectedSeats.some((s) => !s.isLocked || s.isBooked)
    ) {
      return res.status(400).json({ message: 'Invalid or unlocked seats' });
    }

    // mark seats booked
    selectedSeats.forEach((s) => {
      s.isBooked = true;
      s.isLocked = false;
    });
    await seatLayout.save();

    const booking = await MovieBooking.create({
      user: req.user.userId,
      screen: screenId,
      showtime: showtimeId,
      seats: seatIds,
      totalAmount,
      paymentId,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    });

    res.status(201).json({
      message: 'Movie ticket booked successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY MOVIE BOOKINGS (USER)
 */
exports.getMyMovieBookings = async (req, res) => {
  try {
    const bookings = await MovieBooking.find({ user: req.user.userId })
      .populate('screen', 'screenName')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SCREEN BOOKINGS (THEATRE OWNER)
 */
exports.getScreenBookings = async (req, res) => {
  try {
    const bookings = await MovieBooking.find({ screen: req.params.screenId })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CANCEL MOVIE BOOKING (USER)
 * Seats are released
 */
exports.cancelMovieBooking = async (req, res) => {
  try {
    const booking = await MovieBooking.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const seatLayout = await Seat.findOne({ screen: booking.screen });
    if (seatLayout) {
      seatLayout.seats.forEach((s) => {
        if (booking.seats.includes(s._id.toString())) {
          s.isBooked = false;
          s.isLocked = false;
        }
      });
      await seatLayout.save();
    }

    booking.status = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    await booking.save();

    res.json({ message: 'Movie booking cancelled & seats released' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
