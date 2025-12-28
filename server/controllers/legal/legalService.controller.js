const LegalService = require('../../models/legal/LegalService.model');
const Advocate = require('../../models/legal/Advocate.model');

/**
 * CREATE LEGAL SERVICE (ADVOCATE)
 */
exports.createLegalService = async (req, res) => {
  try {
    const advocate = await Advocate.findOne({ user: req.user.userId });
    if (!advocate) {
      return res.status(403).json({ message: 'Advocate not found' });
    }

    const { title, category, description, fee, durationMinutes } = req.body;

    const service = await LegalService.create({
      advocate: advocate._id,
      title,
      category, // e.g. CIVIL | CRIMINAL | FAMILY | CORPORATE
      description,
      fee,
      durationMinutes,
      isActive: true,
    });

    res.status(201).json({
      message: 'Legal service created successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL LEGAL SERVICES (PUBLIC)
 */
exports.getAllLegalServices = async (req, res) => {
  try {
    const services = await LegalService.find({ isActive: true })
      .populate('advocate', 'name experience')
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET LEGAL SERVICES BY ADVOCATE (PUBLIC)
 */
exports.getServicesByAdvocate = async (req, res) => {
  try {
    const services = await LegalService.find({
      advocate: req.params.advocateId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET LEGAL SERVICE BY ID (PUBLIC)
 */
exports.getLegalServiceById = async (req, res) => {
  try {
    const service = await LegalService.findById(req.params.id).populate(
      'advocate',
      'name experience'
    );

    if (!service) {
      return res.status(404).json({ message: 'Legal service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE LEGAL SERVICE (ADVOCATE)
 */
exports.updateLegalService = async (req, res) => {
  try {
    const advocate = await Advocate.findOne({ user: req.user.userId });
    if (!advocate) {
      return res.status(403).json({ message: 'Advocate not found' });
    }

    const allowedFields = [
      'title',
      'category',
      'description',
      'fee',
      'durationMinutes',
    ];

    const updateData = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const service = await LegalService.findOneAndUpdate(
      { _id: req.params.id, advocate: advocate._id },
      updateData,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Legal service not found' });
    }

    res.json({
      message: 'Legal service updated successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE LEGAL SERVICE (ADVOCATE)
 */
exports.toggleLegalServiceStatus = async (req, res) => {
  try {
    const advocate = await Advocate.findOne({ user: req.user.userId });
    if (!advocate) {
      return res.status(403).json({ message: 'Advocate not found' });
    }

    const service = await LegalService.findOne({
      _id: req.params.id,
      advocate: advocate._id,
    });

    if (!service) {
      return res.status(404).json({ message: 'Legal service not found' });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.json({
      message: `Legal service ${
        service.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
