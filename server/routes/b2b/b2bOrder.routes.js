const express = require('express');
const router = express.Router();

const b2bOrderController = require('../../controllers/b2b/b2bOrder.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create order from accepted quotation (buyer)
router.post(
  '/',
  authMiddleware,
  b2bOrderController.createOrderFromQuotation
);

// get my orders (buyer)
router.get(
  '/my',
  authMiddleware,
  b2bOrderController.getMyOrders
);

// get company orders (company owner)
router.get(
  '/company',
  authMiddleware,
  b2bOrderController.getCompanyOrders
);

// update order status (company/admin)
router.patch(
  '/:id/status',
  authMiddleware,
  b2bOrderController.updateOrderStatus
);

module.exports = router;
