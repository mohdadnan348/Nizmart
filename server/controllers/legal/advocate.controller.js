const Advocate = require('../../models/legal/Advocate.model');

/**
 * REGISTER ADVOCATE (SELF)
 */
exports.registerAdvocate = async (req, res) => {
  try {
    const existing = await Advocate.findOne({ user: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Advocate already registered' });
    }

    const advocate = await Advocate.create({
      user: req.user.userId,
      name: req.body.name,
      experience: req.body.experience,
      practiceAreas: req.body.practiceAreas, // array
      consultationFee: req.body.consultationFee,
      courtName: req.body.courtName,
      officeAddress: req.body.officeAddress,
    });

    res.status(201).json({
      message: 'Advocate registered successfully',
      advocate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL ADVOCATES (PUBLIC)
 */
exports.getAllAdvocates = async (req, res) => {
  try {
    const advocates = await Advocate.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(advocates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ADVOCATE BY ID (PUBLIC)
 */
exports.getAdvocateById = async (req, res) => {
  try {
    const advocate = await Advocate.findById(req.params.id);

    if (!advocate) {
      return res.status(404).json({ message: 'Advocate not found' });
    }

    res.json(advocate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE ADVOCATE PROFILE (SELF)
 */
exports.updateAdvocateProfile = async (req, res) => {
  try {
    const advocate = await Advocate.findOneAndUpdate(
      { user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!advocate) {
      return res.status(404).json({ message: 'Advocate not found' });
    }

    res.json({
      message: 'Advocate profile updated successfully',
      advocate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE ADVOCATE (ADMIN)
 */
exports.toggleAdvocateStatus = async (req, res) => {
  try {
    const advocate = await Advocate.findById(req.params.id);

    if (!advocate) {
      return res.status(404).json({ message: 'Advocate not found' });
    }

    advocate.isActive = !advocate.isActive;
    await advocate.save();

    res.json({
      message: `Advocate ${
        advocate.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
