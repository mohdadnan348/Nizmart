const express = require('express');
const router = express.Router();

const controller = require('../../controllers/classified/classifiedCategory.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

router.post('/', authMiddleware, controller.createCategory);
router.get('/', controller.getCategories);

module.exports = router;
