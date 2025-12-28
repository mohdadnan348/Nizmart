const CustomRequirement = require('../../models/event/CustomRequirement.model');
const Vendor = require('../../models/event/Vendor.model');

/**
 * CREATE CUSTOM REQUIREMENT (USER)
 */
exports.createRequirement = async (req, res) => {
  try {
    const {
      eventType,        // e.g. Wedding, Birthday, Corporate
      eventDate,
      location,
      budgetRange,      // { min, max }
      guestCount,
      servicesNeeded,   // array e.g. ['DECORATION','CATERING']
      notes,
    } = req.body;

    const requirement = await CustomRequirement.create({
      user: req.user.userId,
      eventType,
      eventDate,
      location,
      budgetRange,
      guestCount,
      servicesNeeded,
      notes,
      status: 'OPEN',
    });

    res.status(201).json({
      message: 'Custom requirement created successfully',
      requirement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY REQUIREMENTS (USER)
 */
exports.getMyRequirements = async (req, res) => {
  try {
    const requirements = await CustomRequirement.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET OPEN REQUIREMENTS (VENDOR)
 */
exports.getOpenRequirements = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.userId });
    if (!vendor) {
      return res.status(403).json({ message: 'Vendor not found' });
    }

    const requirements = await CustomRequirement.find({ status: 'OPEN' }).sort({
      createdAt: -1,
    });

    res.json(requirements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * SUBMIT QUOTE (VENDOR)
 */
exports.submitQuote = async (req, res) => {
  try {
    const { price, message } = req.body;

    const vendor = await Vendor.findOne({ user: req.user.userId });
    if (!vendor) {
      return res.status(403).json({ message: 'Vendor not found' });
    }

    const requirement = await CustomRequirement.findById(req.params.id);
    if (!requirement || requirement.status !== 'OPEN') {
      return res.status(400).json({ message: 'Requirement not available' });
    }

    // prevent duplicate quote from same vendor
    const alreadyQuoted = requirement.quotes?.some(
      (q) => q.vendor.toString() === vendor._id.toString()
    );
    if (alreadyQuoted) {
      return res
        .status(400)
        .json({ message: 'Quote already submitted' });
    }

    requirement.quotes.push({
      vendor: vendor._id,
      price,
      message,
      status: 'SUBMITTED',
    });

    await requirement.save();

    res.json({
      message: 'Quote submitted successfully',
      requirement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACCEPT QUOTE (USER)
 */
exports.acceptQuote = async (req, res) => {
  try {
    const { quoteId } = req.body;

    const requirement = await CustomRequirement.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!requirement) {
      return res.status(404).json({ message: 'Requirement not found' });
    }

    const quote = requirement.quotes.id(quoteId);
    if (!quote) {
      return res.status(404).json({ message: 'Quote not found' });
    }

    // accept selected quote
    quote.status = 'ACCEPTED';

    // reject others
    requirement.quotes.forEach((q) => {
      if (q._id.toString() !== quoteId) {
        q.status = 'REJECTED';
      }
    });

    requirement.status = 'CLOSED';
    await requirement.save();

    res.json({
      message: 'Quote accepted successfully',
      requirement,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
