const express = require('express');
const router = express.Router();
const serviceReviewController = require('../../controllers/service/serviceReview.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// add review
router.post('/', authMiddleware, serviceReviewController.addReview);

// get my reviews
router.get('/my', authMiddleware, serviceReviewController.getMyReviews);

// get reviews by partner (public)
router.get(
  '/partner/:partnerId',
  serviceReviewController.getReviewsByPartner
);

module.exports = router;
