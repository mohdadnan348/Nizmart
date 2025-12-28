const ServiceBooking = require('../../models/service/ServiceBooking.model');
const Service = require('../../models/service/Service.model');
const ServicePartner = require('../../models/service/ServicePartner.model');

/**
 * CREATE SERVICE BOOKING (USER)
 */
exports.createBooking = async (req, res) => {
  try {
    const { service, address, bookingDate } = req.body;

    const serviceData = await Service.findById(service);
    if (!serviceData || !serviceData.isActive) {
      return res.status(400).json({ message: 'Service not available' });
    }

    const booking = await ServiceBooking.create({
      user: req.user.userId,
      service,
      address,
      bookingDate,
      price: serviceData.basePrice,
    });

    res.status(201).json({
      message: 'Service booking created successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY BOOKINGS (USER)
 */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await ServiceBooking.find({ user: req.user.userId })
      .populate('service', 'name')
      .populate('partner')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET BOOKINGS FOR PARTNER
 */
exports.getPartnerBookings = async (req, res) => {
  try {
    const partner = await ServicePartner.findOne({
      user: req.user.userId,
    });

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    const bookings = await ServiceBooking.find({ partner: partner._id })
      .populate('service', 'name')
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ASSIGN PARTNER (ADMIN / SYSTEM)
 */
exports.assignPartner = async (req, res) => {
  try {
    const { partnerId } = req.body;

    const booking = await ServiceBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.partner = partnerId;
    booking.status = 'ASSIGNED';
    await booking.save();

    res.json({
      message: 'Partner assigned successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE BOOKING STATUS (PARTNER)
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await ServiceBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: 'Booking status updated',
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
    const booking = await ServiceBooking.findOne({
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
