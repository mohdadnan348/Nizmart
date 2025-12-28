const Vendor = require('../../models/event/Vendor.model');

/**
 * REGISTER VENDOR (SELF)
 */
exports.registerVendor = async (req, res) => {
  try {
    const existing = await Vendor.findOne({ user: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Vendor already registered' });
    }

    const vendor = await Vendor.create({
      user: req.user.userId,
      companyName: req.body.companyName,
      servicesOffered: req.body.servicesOffered, // e.g. Decoration, Catering
      experienceYears: req.body.experienceYears,
      baseLocation: req.body.baseLocation,
      contactNumber: req.body.contactNumber,
    });

    res.status(201).json({
      message: 'Vendor registered successfully',
      vendor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL VENDORS (PUBLIC)
 */
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET VENDOR BY ID (PUBLIC)
 */
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE VENDOR PROFILE (SELF)
 */
exports.updateVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndUpdate(
      { user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({
      message: 'Vendor profile updated successfully',
      vendor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE VENDOR (ADMIN)
 */
exports.toggleVendorStatus = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    res.json({
      message: `Vendor ${
        vendor.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
