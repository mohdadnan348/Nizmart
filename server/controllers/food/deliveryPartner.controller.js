const DeliveryPartner = require('../../models/food/DeliveryPartner.model');

/**
 * REGISTER DELIVERY PARTNER (SELF)
 */
exports.registerDeliveryPartner = async (req, res) => {
  try {
    const existing = await DeliveryPartner.findOne({ user: req.user.userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'Delivery partner already registered' });
    }

    const partner = await DeliveryPartner.create({
      user: req.user.userId,
    });

    res.status(201).json({
      message: 'Delivery partner registered successfully',
      partner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL DELIVERY PARTNERS (ADMIN)
 */
exports.getAllDeliveryPartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find()
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * TOGGLE ONLINE / OFFLINE (SELF)
 */
exports.toggleOnlineStatus = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findOne({
      user: req.user.userId,
    });

    if (!partner) {
      return res
        .status(404)
        .json({ message: 'Delivery partner not found' });
    }

    partner.isOnline = !partner.isOnline;
    await partner.save();

    res.json({
      message: `Delivery partner is now ${
        partner.isOnline ? 'ONLINE' : 'OFFLINE'
      }`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE DELIVERY PARTNER STATUS (ADMIN)
 */
exports.toggleActiveStatus = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);

    if (!partner) {
      return res
        .status(404)
        .json({ message: 'Delivery partner not found' });
    }

    partner.isActive = !partner.isActive;
    await partner.save();

    res.json({
      message: `Delivery partner ${
        partner.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
