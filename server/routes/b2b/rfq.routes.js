const express = require('express');
const router = express.Router();

const rfqController = require('../../controllers/b2b/rfq.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create rfq (buyer)
router.post('/', authMiddleware, rfqController.createRFQ);

// get my rfqs (buyer)
router.get('/my', authMiddleware, rfqController.getMyRFQs);

// get all open rfqs (companies)
router.get('/open', authMiddleware, rfqController.getOpenRFQs);

// get rfq by id
router.get('/:id', authMiddleware, rfqController.getRFQById);

// close rfq (buyer)
router.patch(
  '/:id/close',
  authMiddleware,
  rfqController.closeRFQ
);

module.exports = router;
