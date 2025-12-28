const RetailOrder = require('../../models/retail/RetailOrder.model');
const Product = require('../../models/retail/Product.model');
const ProductVariant = require('../../models/retail/ProductVariant.model');
const Seller = require('../../models/retail/Seller.model');

/**
 * CREATE ORDER (USER)
 */
exports.createOrder = async (req, res) => {
  try {
    const { sellerId, items } = req.body;

    let totalAmount = 0;
    const orderItems = [];

    for (const i of items) {
      let price = 0;

      const product = await Product.findById(i.product);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: 'Product not available' });
      }

      if (i.variant) {
        const variant = await ProductVariant.findById(i.variant);
        if (!variant || variant.stock < i.quantity) {
          return res
            .status(400)
            .json({ message: 'Product variant not available' });
        }
        price = variant.price;
        variant.stock -= i.quantity;
        await variant.save();
      } else {
        if (product.stock < i.quantity) {
          return res
            .status(400)
            .json({ message: 'Insufficient product stock' });
        }
        price = product.price;
        product.stock -= i.quantity;
        await product.save();
      }

      totalAmount += price * i.quantity;

      orderItems.push({
        product: product._id,
        variant: i.variant || null,
        quantity: i.quantity,
        price,
      });
    }

    const order = await RetailOrder.create({
      user: req.user.userId,
      seller: sellerId,
      items: orderItems,
      totalAmount,
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY ORDERS (USER)
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await RetailOrder.find({ user: req.user.userId })
      .populate('items.product', 'name')
      .populate('seller', 'shopName')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SELLER ORDERS (SELLER)
 */
exports.getSellerOrders = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.userId });
    if (!seller) {
      return res.status(403).json({ message: 'Seller not found' });
    }

    const orders = await RetailOrder.find({ seller: seller._id })
      .populate('user', 'name phone')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE ORDER STATUS (SELLER / ADMIN)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await RetailOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({
      message: 'Order status updated',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CANCEL ORDER (USER)
 */
exports.cancelOrder = async (req, res) => {
  try {
    const order = await RetailOrder.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
      return res
        .status(400)
        .json({ message: 'Cannot cancel shipped/delivered order' });
    }

    order.status = 'CANCELLED';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
