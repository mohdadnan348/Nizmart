const express = require('express');
const router = express.Router();

const quotationController = require('../../controllers/b2b/quotation.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// company replies to RFQ
router.post('/', authMiddleware, quotationController.createQuotation);

// buyer views quotations for RFQ
router.get(
  '/rfq/:rfqId',
  authMiddleware,
  quotationController.getQuotationsByRFQ
);

// company views its quotations
router.get(
  '/my',
  authMiddleware,
  quotationController.getMyQuotations
);

// buyer accepts quotation
router.patch(
  '/:id/accept',
  authMiddleware,
  quotationController.acceptQuotation
);

// buyer rejects quotation
router.patch(
  '/:id/reject',
  authMiddleware,
  quotationController.rejectQuotation
);

module.exports = router;
