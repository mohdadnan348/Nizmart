const Driver = require('../../models/driver/Driver.model');

/**
 * REGISTER DRIVER (SELF)
 */
exports.registerDriver = async (req, res) => {
  try {
    const existing = await Driver.findOne({ user: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Driver already registered' });
    }

    const driver = await Driver.create({
      user: req.user.userId,
      name: req.body.name,
      phone: req.body.phone,
      licenseNumber: req.body.licenseNumber,
      vehicleType: req.body.vehicleType, // CAR | AUTO | BIKE
      city: req.body.city,
      experienceYears: req.body.experienceYears || 0,
      isAvailable: true,
      isActive: true,
    });

    res.status(201).json({
      message: 'Driver registered successfully',
      driver,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL DRIVERS (PUBLIC)
 */
exports.getAllDrivers = async (req, res) => {
  try {
    const filters = { isActive: true, isAvailable: true };

    if (req.query.city) filters.city = req.query.city;
    if (req.query.vehicleType) filters.vehicleType = req.query.vehicleType;

    const drivers = await Driver.find(filters).sort({ createdAt: -1 });

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY DRIVER PROFILE
 */
exports.getMyProfile = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.userId });

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE DRIVER PROFILE
 */
exports.updateProfile = async (req, res) => {
  try {
    const driver = await Driver.findOneAndUpdate(
      { user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json({
      message: 'Driver profile updated successfully',
      driver,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * TOGGLE DRIVER AVAILABILITY
 */
exports.toggleAvailability = async (req, res) => {
  try {
    const driver = await Driver.findOne({ user: req.user.userId });
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.isAvailable = !driver.isAvailable;
    await driver.save();

    res.json({
      message: `Driver is now ${
        driver.isAvailable ? 'available' : 'unavailable'
      }`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
