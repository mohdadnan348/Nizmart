const FoodOrder = require('../../models/food/FoodOrder.model');
const MenuItem = require('../../models/food/MenuItem.model');
const Restaurant = require('../../models/food/Restaurant.model');
const DeliveryPartner = require('../../models/food/DeliveryPartner.model');

/**
 * CREATE FOOD ORDER (USER)
 */
exports.createOrder = async (req, res) => {
  try {
    const { restaurant, items, deliveryAddress } = req.body;

    const rest = await Restaurant.findById(restaurant);
    if (!rest || !rest.isActive || !rest.isOpen) {
      return res.status(400).json({ message: 'Restaurant not available' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const i of items) {
      const menuItem = await MenuItem.findById(i.menuItem);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ message: 'Menu item not available' });
      }

      const price = menuItem.price * i.quantity;
      totalAmount += price;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: i.quantity,
        price: menuItem.price,
      });
    }

    const order = await FoodOrder.create({
      user: req.user.userId,
      restaurant,
      items: orderItems,
      totalAmount,
      deliveryAddress,
    });

    res.status(201).json({
      message: 'Food order placed successfully',
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
    const orders = await FoodOrder.find({ user: req.user.userId })
      .populate('restaurant', 'name')
      .populate('items.menuItem', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET RESTAURANT ORDERS (RESTAURANT OWNER)
 */
exports.getRestaurantOrders = async (req, res) => {
  try {
    const orders = await FoodOrder.find({
      restaurant: req.params.restaurantId,
    })
      .populate('user', 'name phone')
      .populate('items.menuItem', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE ORDER STATUS (RESTAURANT / DELIVERY)
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await FoodOrder.findById(req.params.id);
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
 * ASSIGN DELIVERY PARTNER (ADMIN / SYSTEM)
 */
exports.assignDeliveryPartner = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;

    const partner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!partner || !partner.isOnline) {
      return res.status(400).json({ message: 'Delivery partner not available' });
    }

    const order = await FoodOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.deliveryPartner = partner._id;
    order.status = 'OUT_FOR_DELIVERY';
    await order.save();

    res.json({
      message: 'Delivery partner assigned',
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
    const order = await FoodOrder.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'DELIVERED') {
      return res.status(400).json({ message: 'Cannot cancel delivered order' });
    }

    order.status = 'CANCELLED';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
