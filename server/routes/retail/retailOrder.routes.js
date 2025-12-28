const express = require('express');
const router = express.Router();
const retailOrderController = require('../../controllers/retail/retailOrder.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// place order (user)
router.post('/', authMiddleware, retailOrderController.createOrder);

// get my orders (user)
router.get('/my', authMiddleware, retailOrderController.getMyOrders);

// get seller orders (seller)
router.get('/seller', authMiddleware, retailOrderController.getSellerOrders);

// update order status (seller/admin)
router.patch(
  '/:id/status',
  authMiddleware,
  retailOrderController.updateOrderStatus
);

// cancel order (user)
router.patch(
  '/:id/cancel',
  authMiddleware,
  retailOrderController.cancelOrder
);

module.exports = router;
