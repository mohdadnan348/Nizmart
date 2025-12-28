const B2BOrder = require('../../models/b2b/B2BOrder.model');
const Quotation = require('../../models/b2b/Quotation.model');
const Company = require('../../models/b2b/Company.model');
const RFQ = require('../../models/b2b/RFQ.model');

/**
 * CREATE B2B ORDER (BUYER)
 * Only from ACCEPTED quotation
 */
exports.createOrderFromQuotation = async (req, res) => {
  try {
    const { quotationId, deliveryAddress } = req.body;

    const quotation = await Quotation.findById(quotationId)
      .populate('rfq')
      .populate('company');

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    if (quotation.status !== 'ACCEPTED') {
      return res
        .status(400)
        .json({ message: 'Only accepted quotation can be converted to order' });
    }

    if (quotation.rfq.buyer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const existingOrder = await B2BOrder.findOne({ quotation: quotationId });
    if (existingOrder) {
      return res
        .status(400)
        .json({ message: 'Order already created for this quotation' });
    }

    const totalAmount =
      quotation.pricePerUnit * quotation.rfq.quantity;

    const order = await B2BOrder.create({
      quotation: quotationId,
      rfq: quotation.rfq._id,
      buyer: req.user.userId,
      company: quotation.company._id,
      product: quotation.rfq.product,
      quantity: quotation.rfq.quantity,
      pricePerUnit: quotation.pricePerUnit,
      totalAmount,
      deliveryAddress,
      status: 'PLACED',
      paymentStatus: 'PENDING',
    });

    res.status(201).json({
      message: 'B2B order created successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY B2B ORDERS (BUYER)
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await B2BOrder.find({ buyer: req.user.userId })
      .populate('company', 'companyName')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET COMPANY ORDERS (COMPANY OWNER)
 */
exports.getCompanyOrders = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user.userId });
    if (!company) {
      return res.status(403).json({ message: 'Company not found' });
    }

    const orders = await B2BOrder.find({ company: company._id })
      .populate('buyer', 'name phone')
      .populate('product', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE ORDER STATUS (COMPANY / ADMIN)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      'PLACED',
      'CONFIRMED',
      'IN_PRODUCTION',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await B2BOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
