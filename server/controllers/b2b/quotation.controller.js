const Quotation = require('../../models/b2b/Quotation.model');
const RFQ = require('../../models/b2b/RFQ.model');
const Company = require('../../models/b2b/Company.model');

/**
 * CREATE QUOTATION (COMPANY REPLY TO RFQ)
 */
exports.createQuotation = async (req, res) => {
  try {
    const { rfqId, pricePerUnit, deliveryDays, notes } = req.body;

    const company = await Company.findOne({ owner: req.user.userId });
    if (!company) {
      return res.status(403).json({ message: 'Company not found' });
    }

    const rfq = await RFQ.findById(rfqId);
    if (!rfq || rfq.status !== 'OPEN') {
      return res.status(400).json({ message: 'RFQ not available' });
    }

    const alreadyQuoted = await Quotation.findOne({
      rfq: rfqId,
      company: company._id,
    });

    if (alreadyQuoted) {
      return res
        .status(400)
        .json({ message: 'Quotation already submitted for this RFQ' });
    }

    const quotation = await Quotation.create({
      rfq: rfqId,
      company: company._id,
      pricePerUnit,
      deliveryDays,
      notes,
      status: 'SUBMITTED',
    });

    res.status(201).json({
      message: 'Quotation submitted successfully',
      quotation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET QUOTATIONS FOR RFQ (BUYER)
 */
exports.getQuotationsByRFQ = async (req, res) => {
  try {
    const quotations = await Quotation.find({
      rfq: req.params.rfqId,
    })
      .populate('company', 'companyName businessType')
      .sort({ createdAt: -1 });

    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY QUOTATIONS (COMPANY)
 */
exports.getMyQuotations = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user.userId });
    if (!company) {
      return res.status(403).json({ message: 'Company not found' });
    }

    const quotations = await Quotation.find({ company: company._id })
      .populate('rfq')
      .sort({ createdAt: -1 });

    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACCEPT QUOTATION (BUYER)
 */
exports.acceptQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('rfq');

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    if (quotation.rfq.buyer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    quotation.status = 'ACCEPTED';
    await quotation.save();

    // reject other quotations for same RFQ
    await Quotation.updateMany(
      { rfq: quotation.rfq._id, _id: { $ne: quotation._id } },
      { status: 'REJECTED' }
    );

    // close RFQ
    quotation.rfq.status = 'CLOSED';
    await quotation.rfq.save();

    res.json({
      message: 'Quotation accepted successfully',
      quotation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * REJECT QUOTATION (BUYER)
 */
exports.rejectQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('rfq');

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    if (quotation.rfq.buyer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    quotation.status = 'REJECTED';
    await quotation.save();

    res.json({ message: 'Quotation rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
