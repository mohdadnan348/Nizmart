const TravelBooking = require('../../models/hotel/TravelBooking.model');
const Hotel = require('../../models/hotel/Hotel.model');

/**
 * CREATE TRAVEL BOOKING (USER)
 * Hotel + Travel Package
 */
exports.createTravelBooking = async (req, res) => {
  try {
    const {
      hotel,
      packageName,
      travelType,     // FLIGHT | TRAIN | BUS | CAB
      departureCity,
      destinationCity,
      departureDate,
      returnDate,
      travellers,
      hotelNights,
      totalAmount,
    } = req.body;

    const hotelData = await Hotel.findById(hotel);
    if (!hotelData || !hotelData.isActive) {
      return res.status(400).json({ message: 'Hotel not available' });
    }

    const booking = await TravelBooking.create({
      user: req.user.userId,
      hotel,
      packageName,
      travelType,
      departureCity,
      destinationCity,
      departureDate,
      returnDate,
      travellers,
      hotelNights,
      totalAmount,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    });

    res.status(201).json({
      message: 'Travel package booked successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY TRAVEL BOOKINGS (USER)
 */
exports.getMyTravelBookings = async (req, res) => {
  try {
    const bookings = await TravelBooking.find({ user: req.user.userId })
      .populate('hotel', 'hotelName city')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET HOTEL TRAVEL BOOKINGS (HOTEL OWNER)
 */
exports.getHotelTravelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user.userId });
    if (!hotel) {
      return res.status(403).json({ message: 'Hotel not found' });
    }

    const bookings = await TravelBooking.find({ hotel: hotel._id })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE TRAVEL BOOKING STATUS (HOTEL / ADMIN)
 * CANCELLED | COMPLETED
 */
exports.updateTravelBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['CANCELLED', 'COMPLETED'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await TravelBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json({
      message: 'Travel booking status updated successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
