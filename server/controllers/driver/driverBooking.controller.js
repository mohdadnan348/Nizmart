const DriverBooking = require('../../models/driver/DriverBooking.model');
const Driver = require('../../models/driver/Driver.model');

/**
 * CREATE DRIVER BOOKING (USER)
 */
exports.createBooking = async (req, res) => {
  try {
    const {
      driverId,
      pickupLocation,
      dropLocation,
      pickupTime,
      estimatedFare,
    } = req.body;

    const driver = await Driver.findById(driverId);
    if (!driver || !driver.isActive || !driver.isAvailable) {
      return res.status(400).json({ message: 'Driver not available' });
    }

    const booking = await DriverBooking.create({
      user: req.user.userId,
      driver: driverId,
      pickupLocation,
      dropLocation,
      pickupTime,
      estimatedFare,
      status: 'CONFIRMED', // CONFIRMED | STARTED | COMPLETED | CANCELLED
      paymentStatus: 'PAID',
    });

    driver.isAvailable = false;
    await driver.save();

    res.status(201).json({
      message: 'Driver booked successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY DRIVER BOOKINGS (USER)
 */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await DriverBooking.find({
      user: req.user.userId,
    })
      .populate('driver', 'name phone vehicleType')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET DRIVER BOOKINGS (DRIVER)
 */
exports.getDriverBookings = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.userId });
    if (!driver) {
      return res.status(403).json({ message: 'Driver not found' });
    }

    const bookings = await DriverBooking.find({ driver: driver._id })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE BOOKING STATUS (DRIVER)
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['STARTED', 'COMPLETED'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await DriverBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;

    if (status === 'COMPLETED') {
      const driver = await Driver.findById(booking.driver);
      if (driver) {
        driver.isAvailable = true;
        await driver.save();
      }
    }

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
    const booking = await DriverBooking.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    await booking.save();

    const driver = await Driver.findById(booking.driver);
    if (driver) {
      driver.isAvailable = true;
      await driver.save();
    }

    res.json({ message: 'Driver booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
