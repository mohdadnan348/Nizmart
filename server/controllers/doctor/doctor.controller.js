const Doctor = require('../../models/doctor/Doctor.model');

/**
 * REGISTER DOCTOR (SELF)
 */
exports.registerDoctor = async (req, res) => {
  try {
    const existing = await Doctor.findOne({ user: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Doctor already registered' });
    }

    const doctor = await Doctor.create({
      user: req.user.userId,
      name: req.body.name,
      specialization: req.body.specialization,
      experience: req.body.experience,
      consultationFee: req.body.consultationFee,
      clinicAddress: req.body.clinicAddress,
      availableDays: req.body.availableDays,
      availableTime: req.body.availableTime,
    });

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL DOCTORS (PUBLIC)
 */
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true })
      .populate('specialization', 'name')
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET DOCTOR BY ID (PUBLIC)
 */
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate(
      'specialization',
      'name'
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE DOCTOR PROFILE (SELF)
 */
exports.updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      message: 'Doctor profile updated successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE DOCTOR (ADMIN)
 */
exports.toggleDoctorStatus = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isActive = !doctor.isActive;
    await doctor.save();

    res.json({
      message: `Doctor ${
        doctor.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
