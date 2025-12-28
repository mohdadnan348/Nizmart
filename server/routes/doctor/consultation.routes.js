const express = require('express');
const router = express.Router();

const consultationController = require('../../controllers/doctor/consultation.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create consultation (doctor)
router.post('/', authMiddleware, consultationController.createConsultation);

// get my consultations (patient)
router.get('/my', authMiddleware, consultationController.getMyConsultations);

// get doctor consultations (doctor)
router.get(
  '/doctor',
  authMiddleware,
  consultationController.getDoctorConsultations
);

// get consultation by id
router.get(
  '/:id',
  authMiddleware,
  consultationController.getConsultationById
);

module.exports = router;
