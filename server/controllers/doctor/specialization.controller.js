const Specialization = require('../../models/doctor/Specialization.model');

/**
 * CREATE SPECIALIZATION (ADMIN)
 */
exports.createSpecialization = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await Specialization.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: 'Specialization already exists' });
    }

    const specialization = await Specialization.create({
      name,
      description,
    });

    res.status(201).json({
      message: 'Specialization created successfully',
      specialization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL SPECIALIZATIONS (PUBLIC)
 */
exports.getAllSpecializations = async (req, res) => {
  try {
    const specializations = await Specialization.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(specializations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SPECIALIZATION BY ID
 */
exports.getSpecializationById = async (req, res) => {
  try {
    const specialization = await Specialization.findById(req.params.id);

    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    res.json(specialization);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE SPECIALIZATION (ADMIN)
 */
exports.updateSpecialization = async (req, res) => {
  try {
    const specialization = await Specialization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    res.json({
      message: 'Specialization updated successfully',
      specialization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE SPECIALIZATION (ADMIN)
 */
exports.toggleSpecializationStatus = async (req, res) => {
  try {
    const specialization = await Specialization.findById(req.params.id);

    if (!specialization) {
      return res.status(404).json({ message: 'Specialization not found' });
    }

    specialization.isActive = !specialization.isActive;
    await specialization.save();

    res.json({
      message: `Specialization ${
        specialization.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
