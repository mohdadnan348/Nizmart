const HotelBooking = require('../../models/hotel/HotelBooking.model');
const Room = require('../../models/hotel/Room.model');
const Hotel = require('../../models/hotel/Hotel.model');

/**
 * CREATE HOTEL BOOKING (USER)
 */
exports.createHotelBooking = async (req, res) => {
  try {
    const {
      room,
      checkInDate,
      checkOutDate,
      roomsBooked,
      guests,
    } = req.body;

    const roomData = await Room.findById(room).populate('hotel');
    if (!roomData || !roomData.isActive) {
      return res.status(400).json({ message: 'Room not available' });
    }

    if (roomData.availableRooms < roomsBooked) {
      return res.status(400).json({ message: 'Not enough rooms available' });
    }

    const nights =
      (new Date(checkOutDate) - new Date(checkInDate)) /
      (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return res.status(400).json({ message: 'Invalid dates' });
    }

    const totalAmount = nights * roomData.pricePerNight * roomsBooked;

    const booking = await HotelBooking.create({
      user: req.user.userId,
      hotel: roomData.hotel._id,
      room,
      checkInDate,
      checkOutDate,
      roomsBooked,
      guests,
      pricePerNight: roomData.pricePerNight,
      totalAmount,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
    });

    // reduce availability
    roomData.availableRooms -= roomsBooked;
    await roomData.save();

    res.status(201).json({
      message: 'Hotel booking confirmed successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY HOTEL BOOKINGS (USER)
 */
exports.getMyHotelBookings = async (req, res) => {
  try {
    const bookings = await HotelBooking.find({ user: req.user.userId })
      .populate('hotel', 'hotelName city')
      .populate('room', 'roomType')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET HOTEL BOOKINGS (HOTEL OWNER)
 */
exports.getHotelBookings = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user.userId });
    if (!hotel) {
      return res.status(403).json({ message: 'Hotel not found' });
    }

    const bookings = await HotelBooking.find({ hotel: hotel._id })
      .populate('user', 'name phone')
      .populate('room', 'roomType')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE BOOKING STATUS (HOTEL OWNER / ADMIN)
 * CHECKED_IN | CHECKED_OUT | CANCELLED
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const booking = await HotelBooking.findById(req.params.id);
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
