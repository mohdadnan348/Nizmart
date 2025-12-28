const express = require('express');
const router = express.Router();

const logisticsCompanyController = require('../../controllers/logistics/logisticsCompany.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// register / list company
router.post('/register', authMiddleware, logisticsCompanyController.registerCompany);

// get my company
router.get('/me', authMiddleware, logisticsCompanyController.getMyCompany);

// update my company
router.put('/me', authMiddleware, logisticsCompanyController.updateMyCompany);

// public list
router.get('/', logisticsCompanyController.getAllCompanies);

// admin toggle
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  logisticsCompanyController.toggleCompanyStatus
);

module.exports = router;
