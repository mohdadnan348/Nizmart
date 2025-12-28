const express = require('express');
const router = express.Router();

const siteVisitController = require('../../controllers/property/siteVisit.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// request site visit (user)
router.post('/', authMiddleware, siteVisitController.requestSiteVisit);

// get my site visits (user)
router.get('/my', authMiddleware, siteVisitController.getMySiteVisits);

// get owner / agent site visits
router.get(
  '/owner',
  authMiddleware,
  siteVisitController.getOwnerSiteVisits
);

// update visit status (owner/admin)
router.patch(
  '/:id/status',
  authMiddleware,
  siteVisitController.updateVisitStatus
);

// cancel visit (user)
router.patch(
  '/:id/cancel',
  authMiddleware,
  siteVisitController.cancelSiteVisit
);

module.exports = router;
