const express = require('express');
const router = express.Router();

const returnRequestController = require('../../controllers/retail/returnRequest.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create return request (user)
router.post('/', authMiddleware, returnRequestController.createReturnRequest);

// get my return requests (user)
router.get('/my', authMiddleware, returnRequestController.getMyReturnRequests);

// get seller return requests (seller)
router.get(
  '/seller',
  authMiddleware,
  returnRequestController.getSellerReturnRequests
);

// update return status (seller/admin)
router.patch(
  '/:id/status',
  authMiddleware,
  returnRequestController.updateReturnStatus
);

module.exports = router;
