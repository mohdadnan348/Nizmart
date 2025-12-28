const express = require('express');
const router = express.Router();

const controller = require('../../controllers/classified/classifiedReport.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

router.post('/', authMiddleware, controller.reportAd);
router.get('/', authMiddleware, controller.getReports);

module.exports = router;
