const BikeOwner = require('../../models/bike/BikeOwner.model');

/**
 * REGISTER BIKE OWNER (SELF)
 */
exports.registerBikeOwner = async (req, res) => {
  try {
    const existing = await BikeOwner.findOne({ user: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Bike owner already registered' });
    }

    const owner = await BikeOwner.create({
      user: req.user.userId,
      name: req.body.name,
      shopName: req.body.shopName,
      phone: req.body.phone,
      city: req.body.city,
      address: req.body.address,
      isActive: true,
    });

    res.status(201).json({
      message: 'Bike owner registered successfully',
      owner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY BIKE OWNER PROFILE
 */
exports.getMyProfile = async (req, res) => {
  try {
    const owner = await BikeOwner.findOne({ user: req.user.userId });

    if (!owner) {
      return res.status(404).json({ message: 'Bike owner not found' });
    }

    res.json(owner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE BIKE OWNER PROFILE
 */
exports.updateProfile = async (req, res) => {
  try {
    const owner = await BikeOwner.findOneAndUpdate(
      { user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!owner) {
      return res.status(404).json({ message: 'Bike owner not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      owner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE BIKE OWNER (ADMIN)
 */
exports.toggleOwnerStatus = async (req, res) => {
  try {
    const owner = await BikeOwner.findById(req.params.id);
    if (!owner) {
      return res.status(404).json({ message: 'Bike owner not found' });
    }

    owner.isActive = !owner.isActive;
    await owner.save();

    res.json({
      message: `Bike owner ${
        owner.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
