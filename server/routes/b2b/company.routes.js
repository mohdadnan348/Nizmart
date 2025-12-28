const express = require('express');
const router = express.Router();

const companyController = require('../../controllers/b2b/company.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin middleware add kar sakte ho

// register company (self)
router.post('/register', authMiddleware, companyController.registerCompany);

// get my company (self)
router.get('/me', authMiddleware, companyController.getMyCompany);

// get all companies (public)
router.get('/', companyController.getAllCompanies);

// get company by id (public)
router.get('/:id', companyController.getCompanyById);

// update company (self)
router.put('/me', authMiddleware, companyController.updateCompany);

// verify / unverify company (admin)
router.patch(
  '/:id/toggle-verify',
  authMiddleware,
  companyController.toggleVerification
);

module.exports = router;
