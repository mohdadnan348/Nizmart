const BikeBooking = require('../../models/bike/BikeBooking.model');
const Bike = require('../../models/bike/Bike.model');
const BikeOwner = require('../../models/bike/BikeOwner.model');

/**
 * CREATE BIKE BOOKING (USER)
 */
exports.createBikeBooking = async (req, res) => {
  try {
    const {
      bikeId,
      startDate,
      endDate,
      pickupLocation,
      dropLocation,
    } = req.body;

    const bike = await Bike.findById(bikeId);
    if (!bike || !bike.isActive || !bike.isAvailable) {
      return res.status(400).json({ message: 'Bike not available' });
    }

    const days =
      (new Date(endDate) - new Date(startDate)) /
      (1000 * 60 * 60 * 24);

    if (days <= 0) {
      return res.status(400).json({ message: 'Invalid rental dates' });
    }

    const rentAmount = days * bike.pricePerDay;
    const totalAmount = rentAmount + (bike.depositAmount || 0);

    const booking = await BikeBooking.create({
      user: req.user.userId,
      bike: bike._id,
      owner: bike.owner,
      startDate,
      endDate,
      pickupLocation,
      dropLocation,
      rentAmount,
      depositAmount: bike.depositAmount || 0,
      totalAmount,
      status: 'CONFIRMED',        // CONFIRMED | PICKED_UP | RETURNED | CANCELLED
      paymentStatus: 'PAID',
    });

    // mark bike unavailable
    bike.isAvailable = false;
    await bike.save();

    res.status(201).json({
      message: 'Bike booked successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY BIKE BOOKINGS (USER)
 */
exports.getMyBikeBookings = async (req, res) => {
  try {
    const bookings = await BikeBooking.find({ user: req.user.userId })
      .populate('bike', 'brand model city')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET OWNER BIKE BOOKINGS (OWNER)
 */
exports.getOwnerBikeBookings = async (req, res) => {
  try {
    const owner = await BikeOwner.findOne({ user: req.user.userId });
    if (!owner) {
      return res.status(403).json({ message: 'Bike owner not found' });
    }

    const bookings = await BikeBooking.find({ owner: owner._id })
      .populate('user', 'name phone')
      .populate('bike', 'brand model')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE BOOKING STATUS (OWNER)
 * PICKED_UP | RETURNED
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['PICKED_UP', 'RETURNED'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await BikeBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;

    // when returned → make bike available again
    if (status === 'RETURNED') {
      const bike = await Bike.findById(booking.bike);
      if (bike) {
        bike.isAvailable = true;
        await bike.save();
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
 * CANCEL BIKE BOOKING (USER)
 */
exports.cancelBikeBooking = async (req, res) => {
  try {
    const booking = await BikeBooking.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = 'CANCELLED';
    booking.paymentStatus = 'REFUNDED';
    await booking.save();

    // release bike
    const bike = await Bike.findById(booking.bike);
    if (bike) {
      bike.isAvailable = true;
      await bike.save();
    }

    res.json({ message: 'Bike booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
