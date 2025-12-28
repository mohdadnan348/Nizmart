const Seller = require('../../models/retail/Seller.model');

/**
 * REGISTER SELLER (SELF)
 */
exports.registerSeller = async (req, res) => {
  try {
    const existing = await Seller.findOne({ user: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Seller already registered' });
    }

    const seller = await Seller.create({
      user: req.user.userId,
      ...req.body,
    });

    res.status(201).json({
      message: 'Seller registered successfully',
      seller,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL SELLERS (ADMIN)
 */
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find()
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SELLER BY ID
 */
exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).populate(
      'user',
      'name phone'
    );

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE SELLER PROFILE (SELF)
 */
exports.updateSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findOneAndUpdate(
      { user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json({
      message: 'Seller profile updated successfully',
      seller,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * VERIFY / UNVERIFY SELLER (ADMIN)
 */
exports.toggleVerification = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    seller.isVerified = !seller.isVerified;
    await seller.save();

    res.json({
      message: `Seller ${
        seller.isVerified ? 'verified' : 'unverified'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE SELLER (ADMIN)
 */
exports.toggleActiveStatus = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    seller.isActive = !seller.isActive;
    await seller.save();

    res.json({
      message: `Seller ${
        seller.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
