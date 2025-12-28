const EventService = require('../../models/event/EventService.model');
const Vendor = require('../../models/event/Vendor.model');

/**
 * CREATE EVENT SERVICE (VENDOR)
 */
exports.createEventService = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.userId });
    if (!vendor) {
      return res.status(403).json({ message: 'Vendor not found' });
    }

    const {
      title,
      category, // e.g. DECORATION | CATERING | PHOTOGRAPHY | SOUND | LIGHTING
      description,
      basePrice,
      durationHours,
      images,
    } = req.body;

    const service = await EventService.create({
      vendor: vendor._id,
      title,
      category,
      description,
      basePrice,
      durationHours,
      images: images || [],
      isActive: true,
    });

    res.status(201).json({
      message: 'Event service created successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL EVENT SERVICES (PUBLIC)
 */
exports.getAllEventServices = async (req, res) => {
  try {
    const services = await EventService.find({ isActive: true })
      .populate('vendor', 'companyName baseLocation experienceYears')
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET EVENT SERVICES BY VENDOR (PUBLIC)
 */
exports.getServicesByVendor = async (req, res) => {
  try {
    const services = await EventService.find({
      vendor: req.params.vendorId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET EVENT SERVICE BY ID (PUBLIC)
 */
exports.getEventServiceById = async (req, res) => {
  try {
    const service = await EventService.findById(req.params.id).populate(
      'vendor',
      'companyName baseLocation experienceYears'
    );

    if (!service) {
      return res.status(404).json({ message: 'Event service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE EVENT SERVICE (VENDOR)
 */
exports.updateEventService = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.userId });
    if (!vendor) {
      return res.status(403).json({ message: 'Vendor not found' });
    }

    const allowedFields = [
      'title',
      'category',
      'description',
      'basePrice',
      'durationHours',
      'images',
    ];

    const updateData = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const service = await EventService.findOneAndUpdate(
      { _id: req.params.id, vendor: vendor._id },
      updateData,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Event service not found' });
    }

    res.json({
      message: 'Event service updated successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE EVENT SERVICE (VENDOR)
 */
exports.toggleEventServiceStatus = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user.userId });
    if (!vendor) {
      return res.status(403).json({ message: 'Vendor not found' });
    }

    const service = await EventService.findOne({
      _id: req.params.id,
      vendor: vendor._id,
    });

    if (!service) {
      return res.status(404).json({ message: 'Event service not found' });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.json({
      message: `Event service ${
        service.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
