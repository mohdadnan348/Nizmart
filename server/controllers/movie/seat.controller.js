const Seat = require('../../models/movie/Seat.model');
const Screen = require('../../models/movie/Screen.model');
const Theatre = require('../../models/movie/Theatre.model');

/**
 * CREATE SEAT LAYOUT (THEATRE OWNER)
 * seats: [{ row: 'A', number: 1, type: 'REGULAR' | 'PREMIUM' | 'VIP' }]
 */
exports.createSeatLayout = async (req, res) => {
  try {
    const theatre = await Theatre.findOne({ owner: req.user.userId });
    if (!theatre) {
      return res.status(403).json({ message: 'Theatre not found' });
    }

    const { screenId, seats } = req.body;

    const screen = await Screen.findOne({
      _id: screenId,
      theatre: theatre._id,
    });

    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    // prevent duplicate layout
    const existing = await Seat.findOne({ screen: screenId });
    if (existing) {
      return res.status(400).json({ message: 'Seat layout already exists' });
    }

    const seatDoc = await Seat.create({
      screen: screenId,
      seats: seats.map((s) => ({
        row: s.row,
        number: s.number,
        type: s.type || 'REGULAR',
        isBooked: false,
        isLocked: false,
      })),
    });

    res.status(201).json({
      message: 'Seat layout created successfully',
      seatLayout: seatDoc,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SEAT LAYOUT BY SCREEN (PUBLIC)
 */
exports.getSeatsByScreen = async (req, res) => {
  try {
    const seatLayout = await Seat.findOne({
      screen: req.params.screenId,
    });

    if (!seatLayout) {
      return res.status(404).json({ message: 'Seat layout not found' });
    }

    res.json(seatLayout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CHECK AVAILABLE SEATS (PUBLIC)
 */
exports.getAvailableSeats = async (req, res) => {
  try {
    const seatLayout = await Seat.findOne({
      screen: req.params.screenId,
    });

    if (!seatLayout) {
      return res.status(404).json({ message: 'Seat layout not found' });
    }

    const availableSeats = seatLayout.seats.filter(
      (s) => !s.isBooked && !s.isLocked
    );

    res.json({
      totalSeats: seatLayout.seats.length,
      availableSeats,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * LOCK SEATS (USER – BEFORE PAYMENT)
 * seatIds: array of seat _id
 */
exports.lockSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;

    const seatLayout = await Seat.findOne({
      screen: req.params.screenId,
    });

    if (!seatLayout) {
      return res.status(404).json({ message: 'Seat layout not found' });
    }

    seatLayout.seats.forEach((seat) => {
      if (
        seatIds.includes(seat._id.toString()) &&
        !seat.isBooked
      ) {
        seat.isLocked = true;
      }
    });

    await seatLayout.save();

    res.json({ message: 'Seats locked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CONFIRM BOOKED SEATS (AFTER PAYMENT)
 */
exports.confirmSeats = async (req, res) => {
  try {
    const { seatIds } = req.body;

    const seatLayout = await Seat.findOne({
      screen: req.params.screenId,
    });

    if (!seatLayout) {
      return res.status(404).json({ message: 'Seat layout not found' });
    }

    seatLayout.seats.forEach((seat) => {
      if (seatIds.includes(seat._id.toString())) {
        seat.isBooked = true;
        seat.isLocked = false;
      }
    });

    await seatLayout.save();

    res.json({ message: 'Seats booked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
