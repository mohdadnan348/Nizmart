const EventBooking = require('../../models/event/EventBooking.model');
const EventService = require('../../models/event/EventService.model');
const Vendor = require('../../models/event/Vendor.model');

/**
 * CREATE EVENT BOOKING (USER)
 */
exports.createEventBooking = async (req, res) => {
  try {
    const {
      eventService,
      eventDate,
      eventLocation,
      guestCount,
      requirements,
    } = req.body;

    const service = await EventService.findById(eventService).populate('vendor');
    if (!service || !service.isActive) {
      return res.status(400).json({ message: 'Event service not available' });
    }

    const booking = await EventBooking.create({
      user: req.user.userId,
      vendor: service.vendor._id,
      eventService,
      eventDate,
      eventLocation,
      guestCount,
      requirements,
      price: service.basePrice,
      status: 'PENDING',
      paymentStatus: 'PENDING',
    });

    res.status(201).json({
      message: 'Event booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY EVENT BOOKINGS (USER)
 */
exports.getMyEventBookings = async (req, res) => {
  try {
    const bookings = await EventBooking.find({ user: req.user.userId })
      .populate('eventService', 'title basePrice')
      .populate('vendor', 'companyName')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET VENDOR EVENT BOOKINGS (VENDOR)
 */
exports.getVendorEventBookings = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.userId });
    if (!vendor) {
      return res.status(403).json({ message: 'Vendor not found' });
    }

    const bookings = await EventBooking.find({ vendor: vendor._id })
      .populate('user', 'name phone')
      .populate('eventService', 'title')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE EVENT BOOKING STATUS (VENDOR / ADMIN)
 * CONFIRMED | COMPLETED | CANCELLED
 */
exports.updateEventBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await EventBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: 'Event booking status updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CANCEL EVENT BOOKING (USER)
 */
exports.cancelEventBooking = async (req, res) => {
  try {
    const booking = await EventBooking.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    res.json({ message: 'Event booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
