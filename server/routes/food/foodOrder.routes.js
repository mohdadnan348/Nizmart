const express = require('express');
const router = express.Router();
const foodOrderController = require('../../controllers/food/foodOrder.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create order (user)
router.post('/', authMiddleware, foodOrderController.createOrder);

// get my orders (user)
router.get('/my', authMiddleware, foodOrderController.getMyOrders);

// get restaurant orders (restaurant owner)
router.get(
  '/restaurant/:restaurantId',
  authMiddleware,
  foodOrderController.getRestaurantOrders
);

// update order status (restaurant / delivery)
router.patch(
  '/:id/status',
  authMiddleware,
  foodOrderController.updateOrderStatus
);

// assign delivery partner (admin/system)
router.patch(
  '/:id/assign-delivery',
  authMiddleware,
  foodOrderController.assignDeliveryPartner
);

// cancel order (user)
router.patch(
  '/:id/cancel',
  authMiddleware,
  foodOrderController.cancelOrder
);

module.exports = router;
