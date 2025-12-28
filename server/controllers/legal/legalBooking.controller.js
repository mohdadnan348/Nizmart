const LegalBooking = require('../../models/legal/LegalBooking.model');
const LegalService = require('../../models/legal/LegalService.model');
const Advocate = require('../../models/legal/Advocate.model');

/**
 * CREATE LEGAL BOOKING (USER)
 */
exports.createLegalBooking = async (req, res) => {
  try {
    const { legalService, bookingDate, timeSlot, caseSummary } = req.body;

    const service = await LegalService.findById(legalService).populate('advocate');
    if (!service || !service.isActive) {
      return res.status(400).json({ message: 'Legal service not available' });
    }

    const booking = await LegalBooking.create({
      user: req.user.userId,
      advocate: service.advocate._id,
      legalService,
      bookingDate,
      timeSlot,
      caseSummary,
      fee: service.fee,
      status: 'PENDING',
      paymentStatus: 'PENDING',
    });

    res.status(201).json({
      message: 'Legal booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY LEGAL BOOKINGS (USER)
 */
exports.getMyLegalBookings = async (req, res) => {
  try {
    const bookings = await LegalBooking.find({ user: req.user.userId })
      .populate('legalService', 'title fee')
      .populate('advocate', 'name')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ADVOCATE BOOKINGS (ADVOCATE)
 */
exports.getAdvocateBookings = async (req, res) => {
  try {
    const advocate = await Advocate.findOne({ user: req.user.userId });
    if (!advocate) {
      return res.status(403).json({ message: 'Advocate not found' });
    }

    const bookings = await LegalBooking.find({ advocate: advocate._id })
      .populate('user', 'name phone')
      .populate('legalService', 'title')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE BOOKING STATUS (ADVOCATE / ADMIN)
 * CONFIRMED | COMPLETED | CANCELLED
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await LegalBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CANCEL BOOKING (USER)
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await LegalBooking.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
