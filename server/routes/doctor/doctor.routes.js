const express = require('express');
const router = express.Router();

const doctorController = require('../../controllers/doctor/doctor.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// register doctor (self)
router.post('/register', authMiddleware, doctorController.registerDoctor);

// get all doctors (public)
router.get('/', doctorController.getAllDoctors);

// get doctor by id (public)
router.get('/:id', doctorController.getDoctorById);

// update doctor profile (self)
router.put(
  '/profile/update',
  authMiddleware,
  doctorController.updateDoctorProfile
);

// activate / deactivate doctor (admin)
router.patch(
  '/:id/toggle-status',
  authMiddleware,
  doctorController.toggleDoctorStatus
);

module.exports = router;
