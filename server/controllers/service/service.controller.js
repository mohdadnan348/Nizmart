const Service = require('../../models/service/Service.model');
const ServiceCategory = require('../../models/service/ServiceCategory.model');

/**
 * CREATE SERVICE (ADMIN)
 */
exports.createService = async (req, res) => {
  try {
    const { category, name, description, basePrice, durationInMinutes } =
      req.body;

    const categoryExists = await ServiceCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid service category' });
    }

    const service = await Service.create({
      category,
      name,
      description,
      basePrice,
      durationInMinutes,
    });

    res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL SERVICES (PUBLIC)
 */
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('category', 'name icon')
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SERVICES BY CATEGORY (PUBLIC)
 */
exports.getServicesByCategory = async (req, res) => {
  try {
    const services = await Service.find({
      category: req.params.categoryId,
      isActive: true,
    }).populate('category', 'name icon');

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET SERVICE BY ID
 */
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      'category',
      'name icon'
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE SERVICE (ADMIN)
 */
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE SERVICE (ADMIN)
 */
exports.toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.json({
      message: `Service ${
        service.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
