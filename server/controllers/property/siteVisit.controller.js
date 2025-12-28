const SiteVisit = require('../../models/property/SiteVisit.model');
const Property = require('../../models/property/Property.model');
const PropertyOwner = require('../../models/property/PropertyOwner.model');

/**
 * REQUEST SITE VISIT (USER)
 */
exports.requestSiteVisit = async (req, res) => {
  try {
    const { propertyId, preferredDate, preferredTime, notes } = req.body;

    const property = await Property.findById(propertyId);
    if (!property || !property.isActive) {
      return res.status(400).json({ message: 'Property not available' });
    }

    const visit = await SiteVisit.create({
      user: req.user.userId,
      property: propertyId,
      owner: property.owner,
      preferredDate,
      preferredTime,
      notes,
      status: 'REQUESTED', // REQUESTED | CONFIRMED | COMPLETED | CANCELLED
    });

    res.status(201).json({
      message: 'Site visit requested successfully',
      visit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY SITE VISITS (USER)
 */
exports.getMySiteVisits = async (req, res) => {
  try {
    const visits = await SiteVisit.find({ user: req.user.userId })
      .populate('property', 'title city price')
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET OWNER / AGENT SITE VISITS
 */
exports.getOwnerSiteVisits = async (req, res) => {
  try {
    const owner = await PropertyOwner.findOne({ user: req.user.userId });
    if (!owner) {
      return res.status(403).json({ message: 'Owner not found' });
    }

    const visits = await SiteVisit.find({ owner: owner._id })
      .populate('user', 'name phone')
      .populate('property', 'title city')
      .sort({ createdAt: -1 });

    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE VISIT STATUS (OWNER / ADMIN)
 * CONFIRMED | COMPLETED | CANCELLED
 */
exports.updateVisitStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const visit = await SiteVisit.findById(req.params.id);
    if (!visit) {
      return res.status(404).json({ message: 'Site visit not found' });
    }

    visit.status = status;
    await visit.save();

    res.json({
      message: 'Site visit status updated successfully',
      visit,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CANCEL SITE VISIT (USER)
 */
exports.cancelSiteVisit = async (req, res) => {
  try {
    const visit = await SiteVisit.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!visit) {
      return res.status(404).json({ message: 'Site visit not found' });
    }

    visit.status = 'CANCELLED';
    await visit.save();

    res.json({ message: 'Site visit cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
