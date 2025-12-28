const RFQ = require('../../models/b2b/RFQ.model');
const Company = require('../../models/b2b/Company.model');
const B2BProduct = require('../../models/b2b/B2BProduct.model');

/**
 * CREATE RFQ (BUYER)
 */
exports.createRFQ = async (req, res) => {
  try {
    const {
      product,
      quantity,
      expectedPrice,
      deliveryLocation,
      notes,
      requiredBy,
    } = req.body;

    const productExists = await B2BProduct.findById(product);
    if (!productExists || !productExists.isActive) {
      return res.status(400).json({ message: 'Invalid B2B product' });
    }

    const rfq = await RFQ.create({
      buyer: req.user.userId,
      product,
      quantity,
      expectedPrice,
      deliveryLocation,
      notes,
      requiredBy,
    });

    res.status(201).json({
      message: 'RFQ created successfully',
      rfq,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY RFQs (BUYER)
 */
exports.getMyRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find({ buyer: req.user.userId })
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL OPEN RFQs (COMPANY / SELLER)
 */
exports.getOpenRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.find({ status: 'OPEN' })
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET RFQ BY ID
 */
exports.getRFQById = async (req, res) => {
  try {
    const rfq = await RFQ.findById(req.params.id)
      .populate('product', 'name')
      .populate('buyer', 'name');

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    res.json(rfq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CLOSE RFQ (BUYER)
 */
exports.closeRFQ = async (req, res) => {
  try {
    const rfq = await RFQ.findOne({
      _id: req.params.id,
      buyer: req.user.userId,
    });

    if (!rfq) {
      return res.status(404).json({ message: 'RFQ not found' });
    }

    rfq.status = 'CLOSED';
    await rfq.save();

    res.json({ message: 'RFQ closed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
