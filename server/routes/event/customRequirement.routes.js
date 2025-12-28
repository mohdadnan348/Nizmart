const express = require('express');
const router = express.Router();

const customRequirementController = require('../../controllers/event/customRequirement.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create requirement (user)
router.post('/', authMiddleware, customRequirementController.createRequirement);

// get my requirements (user)
router.get('/my', authMiddleware, customRequirementController.getMyRequirements);

// get open requirements (vendor)
router.get(
  '/open',
  authMiddleware,
  customRequirementController.getOpenRequirements
);

// submit quote (vendor)
router.post(
  '/:id/quote',
  authMiddleware,
  customRequirementController.submitQuote
);

// accept quote (user)
router.patch(
  '/:id/accept-quote',
  authMiddleware,
  customRequirementController.acceptQuote
);

module.exports = router;
