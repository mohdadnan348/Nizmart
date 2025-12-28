const ReturnRequest = require('../../models/retail/ReturnRequest.model');
const RetailOrder = require('../../models/retail/RetailOrder.model');
const Seller = require('../../models/retail/Seller.model');

/**
 * CREATE RETURN REQUEST (USER)
 * Only for DELIVERED orders
 */
exports.createReturnRequest = async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const order = await RetailOrder.findOne({
      _id: orderId,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'DELIVERED') {
      return res
        .status(400)
        .json({ message: 'Return allowed only after delivery' });
    }

    const existing = await ReturnRequest.findOne({ order: orderId });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'Return request already created' });
    }

    const request = await ReturnRequest.create({
      order: orderId,
      user: req.user.userId,
      reason,
    });

    // mark order as return requested
    order.status = 'RETURN_REQUESTED';
    await order.save();

    res.status(201).json({
      message: 'Return request submitted successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY RETURN REQUESTS (USER)
 */
exports.getMyReturnRequests = async (req, res) => {
  try {
    const requests = await ReturnRequest.find({ user: req.user.userId })
      .populate('order')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SELLER RETURN REQUESTS (SELLER)
 */
exports.getSellerReturnRequests = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.userId });
    if (!seller) {
      return res.status(403).json({ message: 'Seller not found' });
    }

    const requests = await ReturnRequest.find()
      .populate({
        path: 'order',
        match: { seller: seller._id },
        populate: { path: 'user', select: 'name phone' },
      })
      .sort({ createdAt: -1 });

    // filter null orders (other sellers)
    res.json(requests.filter((r) => r.order));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE RETURN STATUS (SELLER / ADMIN)
 * APPROVED | REJECTED | REFUNDED
 */
exports.updateReturnStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED', 'REFUNDED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const request = await ReturnRequest.findById(req.params.id).populate(
      'order'
    );

    if (!request) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    request.status = status;
    await request.save();

    // sync order status
    if (status === 'REJECTED') {
      request.order.status = 'DELIVERED';
    }
    if (status === 'REFUNDED') {
      request.order.status = 'RETURNED';
      request.order.paymentStatus = 'REFUNDED';
      // 👉 yahan wallet refund hook laga sakte ho
    }

    await request.order.save();

    res.json({
      message: 'Return request updated successfully',
      request,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
