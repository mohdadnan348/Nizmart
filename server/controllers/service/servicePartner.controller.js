const ServicePartner = require('../../models/service/ServicePartner.model');
const User = require('../../models/user/User.model');

/**
 * CREATE / REGISTER SERVICE PARTNER (SELF)
 */
exports.registerPartner = async (req, res) => {
  try {
    const existing = await ServicePartner.findOne({ user: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Partner already registered' });
    }

    const partner = await ServicePartner.create({
      user: req.user.userId,
      ...req.body,
    });

    res.status(201).json({
      message: 'Service partner registered successfully',
      partner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL PARTNERS (ADMIN)
 */
exports.getAllPartners = async (req, res) => {
  try {
    const partners = await ServicePartner.find()
      .populate('user', 'name phone')
      .populate('skills', 'name')
      .sort({ createdAt: -1 });

    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PARTNER BY ID
 */
exports.getPartnerById = async (req, res) => {
  try {
    const partner = await ServicePartner.findById(req.params.id)
      .populate('user', 'name phone')
      .populate('skills', 'name');

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PARTNER PROFILE (SELF)
 */
exports.updatePartnerProfile = async (req, res) => {
  try {
    const partner = await ServicePartner.findOne({
      user: req.user.userId,
    });

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    Object.assign(partner, req.body);
    await partner.save();

    res.json({
      message: 'Partner profile updated successfully',
      partner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * TOGGLE ONLINE / OFFLINE (SELF)
 */
exports.toggleOnlineStatus = async (req, res) => {
  try {
    const partner = await ServicePartner.findOne({
      user: req.user.userId,
    });

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    partner.isOnline = !partner.isOnline;
    await partner.save();

    res.json({
      message: `Partner is now ${
        partner.isOnline ? 'ONLINE' : 'OFFLINE'
      }`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * VERIFY / UNVERIFY PARTNER (ADMIN)
 */
exports.toggleVerification = async (req, res) => {
  try {
    const partner = await ServicePartner.findById(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    partner.isVerified = !partner.isVerified;
    await partner.save();

    res.json({
      message: `Partner ${
        partner.isVerified ? 'verified' : 'unverified'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
