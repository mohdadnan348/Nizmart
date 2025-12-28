const TableBooking = require('../../models/food/TableBooking.model');
const Restaurant = require('../../models/food/Restaurant.model');

/**
 * CREATE TABLE BOOKING (USER)
 */
exports.createTableBooking = async (req, res) => {
  try {
    const { restaurant, bookingDate, numberOfPeople, specialRequest } =
      req.body;

    const rest = await Restaurant.findById(restaurant);
    if (!rest || !rest.isActive || !rest.isOpen) {
      return res.status(400).json({ message: 'Restaurant not available' });
    }

    const booking = await TableBooking.create({
      user: req.user.userId,
      restaurant,
      bookingDate,
      numberOfPeople,
      specialRequest,
    });

    res.status(201).json({
      message: 'Table booked successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY TABLE BOOKINGS (USER)
 */
exports.getMyTableBookings = async (req, res) => {
  try {
    const bookings = await TableBooking.find({ user: req.user.userId })
      .populate('restaurant', 'name address')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET RESTAURANT TABLE BOOKINGS (RESTAURANT OWNER)
 */
exports.getRestaurantTableBookings = async (req, res) => {
  try {
    const bookings = await TableBooking.find({
      restaurant: req.params.restaurantId,
    })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE TABLE BOOKING STATUS (RESTAURANT)
 */
exports.updateTableBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await TableBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Table booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: 'Table booking status updated',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CANCEL TABLE BOOKING (USER)
 */
exports.cancelTableBooking = async (req, res) => {
  try {
    const booking = await TableBooking.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Table booking not found' });
    }

    booking.status = 'CANCELLED';
    await booking.save();

    res.json({ message: 'Table booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
