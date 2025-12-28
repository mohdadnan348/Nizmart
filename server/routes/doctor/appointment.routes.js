const express = require('express');
const router = express.Router();

const appointmentController = require('../../controllers/doctor/appointment.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// create appointment (patient)
router.post('/', authMiddleware, appointmentController.createAppointment);

// get my appointments (patient)
router.get('/my', authMiddleware, appointmentController.getMyAppointments);

// get doctor appointments (doctor)
router.get(
  '/doctor',
  authMiddleware,
  appointmentController.getDoctorAppointments
);

// update appointment status (doctor/admin)
router.patch(
  '/:id/status',
  authMiddleware,
  appointmentController.updateAppointmentStatus
);

// cancel appointment (patient)
router.patch(
  '/:id/cancel',
  authMiddleware,
  appointmentController.cancelAppointment
);

module.exports = router;
