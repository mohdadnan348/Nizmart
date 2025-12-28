const Appointment = require('../../models/doctor/Appointment.model');
const Doctor = require('../../models/doctor/Doctor.model');

/**
 * CREATE APPOINTMENT (PATIENT / USER)
 */
exports.createAppointment = async (req, res) => {
  try {
    const { doctor, appointmentDate, timeSlot, symptoms } = req.body;

    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists || !doctorExists.isActive) {
      return res.status(400).json({ message: 'Doctor not available' });
    }

    const appointment = await Appointment.create({
      user: req.user.userId,
      doctor,
      appointmentDate,
      timeSlot,
      symptoms,
      status: 'PENDING',
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY APPOINTMENTS (PATIENT)
 */
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user.userId })
      .populate('doctor', 'name consultationFee')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET DOCTOR APPOINTMENTS (DOCTOR)
 */
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.userId });
    if (!doctor) {
      return res.status(403).json({ message: 'Doctor not found' });
    }

    const appointments = await Appointment.find({ doctor: doctor._id })
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE APPOINTMENT STATUS (DOCTOR / ADMIN)
 * CONFIRMED | COMPLETED | CANCELLED
 */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['CONFIRMED', 'COMPLETED', 'CANCELLED'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: 'Appointment status updated',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CANCEL APPOINTMENT (PATIENT)
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = 'CANCELLED';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
