const Bike = require('../../models/bike/Bike.model');
const BikeOwner = require('../../models/bike/BikeOwner.model');

/**
 * CREATE BIKE (OWNER)
 */
exports.createBike = async (req, res) => {
  try {
    const owner = await BikeOwner.findOne({ user: req.user.userId });
    if (!owner) {
      return res.status(403).json({ message: 'Bike owner not found' });
    }

    const {
      brand,
      model,
      bikeType,        // SCOOTER | BIKE | SPORTS
      fuelType,        // PETROL | ELECTRIC
      pricePerDay,
      depositAmount,
      city,
      images,
    } = req.body;

    const bike = await Bike.create({
      owner: owner._id,
      brand,
      model,
      bikeType,
      fuelType,
      pricePerDay,
      depositAmount,
      city,
      images: images || [],
      isAvailable: true,
      isActive: true,
    });

    res.status(201).json({
      message: 'Bike listed successfully',
      bike,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL BIKES (PUBLIC)
 */
exports.getAllBikes = async (req, res) => {
  try {
    const filters = { isActive: true, isAvailable: true };

    if (req.query.city) filters.city = req.query.city;
    if (req.query.bikeType) filters.bikeType = req.query.bikeType;

    const bikes = await Bike.find(filters)
      .populate('owner', 'shopName city')
      .sort({ createdAt: -1 });

    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET BIKE BY ID (PUBLIC)
 */
exports.getBikeById = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id).populate(
      'owner',
      'shopName phone city'
    );

    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    res.json(bike);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY BIKES (OWNER)
 */
exports.getMyBikes = async (req, res) => {
  try {
    const owner = await BikeOwner.findOne({ user: req.user.userId });
    if (!owner) {
      return res.status(403).json({ message: 'Bike owner not found' });
    }

    const bikes = await Bike.find({ owner: owner._id }).sort({
      createdAt: -1,
    });

    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE BIKE (OWNER)
 */
exports.updateBike = async (req, res) => {
  try {
    const owner = await BikeOwner.findOne({ user: req.user.userId });
    if (!owner) {
      return res.status(403).json({ message: 'Bike owner not found' });
    }

    const allowedFields = [
      'brand',
      'model',
      'bikeType',
      'fuelType',
      'pricePerDay',
      'depositAmount',
      'city',
      'images',
    ];

    const updateData = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const bike = await Bike.findOneAndUpdate(
      { _id: req.params.id, owner: owner._id },
      updateData,
      { new: true }
    );

    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    res.json({
      message: 'Bike updated successfully',
      bike,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * TOGGLE BIKE AVAILABILITY (OWNER)
 */
exports.toggleAvailability = async (req, res) => {
  try {
    const owner = await BikeOwner.findOne({ user: req.user.userId });
    if (!owner) {
      return res.status(403).json({ message: 'Bike owner not found' });
    }

    const bike = await Bike.findOne({
      _id: req.params.id,
      owner: owner._id,
    });

    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    bike.isAvailable = !bike.isAvailable;
    await bike.save();

    res.json({
      message: `Bike ${
        bike.isAvailable ? 'available' : 'unavailable'
      } now`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE BIKE (OWNER / ADMIN)
 */
exports.toggleBikeStatus = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
      return res.status(404).json({ message: 'Bike not found' });
    }

    bike.isActive = !bike.isActive;
    await bike.save();

    res.json({
      message: `Bike ${
        bike.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
