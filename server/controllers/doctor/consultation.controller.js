const Consultation = require('../../models/doctor/Consultation.model');
const Appointment = require('../../models/doctor/Appointment.model');
const Doctor = require('../../models/doctor/Doctor.model');

/**
 * CREATE CONSULTATION (DOCTOR)
 * Only for CONFIRMED appointment
 */
exports.createConsultation = async (req, res) => {
  try {
    const {
      appointmentId,
      mode, // CHAT | VIDEO | IN_PERSON
      diagnosis,
      prescription,
      notes,
      followUpDate,
    } = req.body;

    const doctor = await Doctor.findOne({ user: req.user.userId });
    if (!doctor) {
      return res.status(403).json({ message: 'Doctor not found' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (appointment.status !== 'CONFIRMED') {
      return res
        .status(400)
        .json({ message: 'Consultation allowed only for confirmed appointment' });
    }

    const existing = await Consultation.findOne({ appointment: appointmentId });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'Consultation already created' });
    }

    const consultation = await Consultation.create({
      appointment: appointmentId,
      doctor: doctor._id,
      user: appointment.user,
      mode,
      diagnosis,
      prescription,
      notes,
      followUpDate,
    });

    // mark appointment completed
    appointment.status = 'COMPLETED';
    await appointment.save();

    res.status(201).json({
      message: 'Consultation created successfully',
      consultation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY CONSULTATIONS (PATIENT)
 */
exports.getMyConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find({ user: req.user.userId })
      .populate('doctor', 'name')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET DOCTOR CONSULTATIONS (DOCTOR)
 */
exports.getDoctorConsultations = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.userId });
    if (!doctor) {
      return res.status(403).json({ message: 'Doctor not found' });
    }

    const consultations = await Consultation.find({ doctor: doctor._id })
      .populate('user', 'name phone')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET CONSULTATION BY ID (PATIENT / DOCTOR)
 */
exports.getConsultationById = async (req, res) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('doctor', 'name')
      .populate('user', 'name phone')
      .populate('appointment');

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    // access control
    if (
      consultation.user.toString() !== req.user.userId &&
      consultation.doctor.user.toString() !== req.user.userId
    ) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
