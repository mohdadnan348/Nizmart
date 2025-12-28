const Room = require('../../models/hotel/Room.model');
const Hotel = require('../../models/hotel/Hotel.model');

/**
 * CREATE ROOM (HOTEL OWNER)
 */
exports.createRoom = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user.userId });
    if (!hotel) {
      return res.status(403).json({ message: 'Hotel not found' });
    }

    const {
      roomType,          // STANDARD | DELUXE | SUITE
      description,
      pricePerNight,
      maxGuests,
      totalRooms,
      amenities,
      images,
    } = req.body;

    const room = await Room.create({
      hotel: hotel._id,
      roomType,
      description,
      pricePerNight,
      maxGuests,
      totalRooms,
      availableRooms: totalRooms,
      amenities: amenities || [],
      images: images || [],
      isActive: true,
    });

    res.status(201).json({
      message: 'Room created successfully',
      room,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ROOMS BY HOTEL (PUBLIC)
 */
exports.getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await Room.find({
      hotel: req.params.hotelId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ROOM BY ID (PUBLIC)
 */
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CHECK AVAILABILITY (PUBLIC)
 * ?rooms=2
 */
exports.checkAvailability = async (req, res) => {
  try {
    const { rooms = 1 } = req.query;

    const room = await Room.findById(req.params.id);
    if (!room || !room.isActive) {
      return res.status(404).json({ message: 'Room not available' });
    }

    const isAvailable = room.availableRooms >= Number(rooms);

    res.json({
      roomId: room._id,
      requestedRooms: Number(rooms),
      availableRooms: room.availableRooms,
      isAvailable,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE ROOM (HOTEL OWNER)
 */
exports.updateRoom = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user.userId });
    if (!hotel) {
      return res.status(403).json({ message: 'Hotel not found' });
    }

    const allowedFields = [
      'roomType',
      'description',
      'pricePerNight',
      'maxGuests',
      'totalRooms',
      'amenities',
      'images',
    ];

    const updateData = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    if (updateData.totalRooms !== undefined) {
      updateData.availableRooms = updateData.totalRooms;
    }

    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, hotel: hotel._id },
      updateData,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({
      message: 'Room updated successfully',
      room,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE ROOM (HOTEL OWNER)
 */
exports.toggleRoomStatus = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.user.userId });
    if (!hotel) {
      return res.status(403).json({ message: 'Hotel not found' });
    }

    const room = await Room.findOne({
      _id: req.params.id,
      hotel: hotel._id,
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.isActive = !room.isActive;
    await room.save();

    res.json({
      message: `Room ${
        room.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
