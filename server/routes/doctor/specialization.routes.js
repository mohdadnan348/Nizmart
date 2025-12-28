const express = require('express');
const router = express.Router();

const specializationController = require('../../controllers/doctor/specialization.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');
// future: admin middleware add kar sakte ho

// create specialization (admin)
router.post('/', authMiddleware, specializationController.createSpecialization);

// get all specializations (public)
router.get('/', specializationController.getAllSpecializations);

// get specialization by id
router.get('/:id', specializationController.getSpecializationById);

// update specialization (admin)
router.put('/:id', authMiddleware, specializationController.updateSpecialization);

// activate / deactivate specialization (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  specializationController.toggleSpecializationStatus
);

module.exports = router;
