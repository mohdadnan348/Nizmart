const PropertyOwner = require('../../models/property/PropertyOwner.model');

/**
 * REGISTER PROPERTY OWNER / AGENT (SELF)
 */
exports.registerOwner = async (req, res) => {
  try {
    const existing = await PropertyOwner.findOne({ user: req.user.userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'Property owner already registered' });
    }

    const owner = await PropertyOwner.create({
      user: req.user.userId,
      name: req.body.name,
      role: req.body.role || 'OWNER', // OWNER | AGENT
      companyName: req.body.companyName,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      experienceYears: req.body.experienceYears || 0,
      isActive: true,
    });

    res.status(201).json({
      message: 'Property owner registered successfully',
      owner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY OWNER PROFILE (SELF)
 */
exports.getMyProfile = async (req, res) => {
  try {
    const owner = await PropertyOwner.findOne({ user: req.user.userId });

    if (!owner) {
      return res.status(404).json({ message: 'Owner profile not found' });
    }

    res.json(owner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL OWNERS / AGENTS (ADMIN / PUBLIC)
 */
exports.getAllOwners = async (req, res) => {
  try {
    const owners = await PropertyOwner.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(owners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE OWNER PROFILE (SELF)
 */
exports.updateOwnerProfile = async (req, res) => {
  try {
    const owner = await PropertyOwner.findOneAndUpdate(
      { user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!owner) {
      return res.status(404).json({ message: 'Owner profile not found' });
    }

    res.json({
      message: 'Owner profile updated successfully',
      owner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE OWNER (ADMIN)
 */
exports.toggleOwnerStatus = async (req, res) => {
  try {
    const owner = await PropertyOwner.findById(req.params.id);

    if (!owner) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    owner.isActive = !owner.isActive;
    await owner.save();

    res.json({
      message: `Owner ${
        owner.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
