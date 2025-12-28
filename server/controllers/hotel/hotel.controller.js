const Hotel = require('../../models/hotel/Hotel.model');

/**
 * REGISTER HOTEL (OWNER)
 */
exports.registerHotel = async (req, res) => {
  try {
    const existing = await Hotel.findOne({ owner: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Hotel already registered' });
    }

    const hotel = await Hotel.create({
      owner: req.user.userId,
      hotelName: req.body.hotelName,
      description: req.body.description,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      contactNumber: req.body.contactNumber,
      amenities: req.body.amenities || [],
      images: req.body.images || [],
      isActive: true,
    });

    res.status(201).json({
      message: 'Hotel registered successfully',
      hotel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL HOTELS (PUBLIC)
 */
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET HOTEL BY ID (PUBLIC)
 */
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE HOTEL (OWNER)
 */
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndUpdate(
      { owner: req.user.userId },
      req.body,
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json({
      message: 'Hotel updated successfully',
      hotel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE HOTEL (ADMIN)
 */
exports.toggleHotelStatus = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    hotel.isActive = !hotel.isActive;
    await hotel.save();

    res.json({
      message: `Hotel ${
        hotel.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
