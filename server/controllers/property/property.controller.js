const Property = require('../../models/property/Property.model');
const PropertyOwner = require('../../models/property/PropertyOwner.model');

/**
 * CREATE PROPERTY (OWNER / AGENT)
 */
exports.createProperty = async (req, res) => {
  try {
    const owner = await PropertyOwner.findOne({ user: req.user.userId });
    if (!owner) {
      return res.status(403).json({ message: 'Property owner not found' });
    }

    const property = await Property.create({
      owner: owner._id,
      title: req.body.title,
      propertyType: req.body.propertyType, // HOUSE | FLAT | PLOT | COMMERCIAL
      purpose: req.body.purpose, // SALE | RENT
      price: req.body.price,
      area: req.body.area,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      amenities: req.body.amenities || [],
      images: req.body.images || [],
      description: req.body.description,
      isActive: true,
    });

    res.status(201).json({
      message: 'Property listed successfully',
      property,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL PROPERTIES (PUBLIC)
 */
exports.getAllProperties = async (req, res) => {
  try {
    const filters = { isActive: true };

    if (req.query.city) filters.city = req.query.city;
    if (req.query.purpose) filters.purpose = req.query.purpose;
    if (req.query.propertyType)
      filters.propertyType = req.query.propertyType;

    const properties = await Property.find(filters)
      .populate('owner', 'name phone')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PROPERTY BY ID (PUBLIC)
 */
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name phone'
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY PROPERTIES (OWNER / AGENT)
 */
exports.getMyProperties = async (req, res) => {
  try {
    const owner = await PropertyOwner.findOne({ user: req.user.userId });
    if (!owner) {
      return res.status(403).json({ message: 'Property owner not found' });
    }

    const properties = await Property.find({ owner: owner._id }).sort({
      createdAt: -1,
    });

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PROPERTY (OWNER / AGENT)
 */
exports.updateProperty = async (req, res) => {
  try {
    const owner = await PropertyOwner.findOne({ user: req.user.userId });
    if (!owner) {
      return res.status(403).json({ message: 'Property owner not found' });
    }

    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, owner: owner._id },
      req.body,
      { new: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({
      message: 'Property updated successfully',
      property,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE PROPERTY (OWNER / ADMIN)
 */
exports.togglePropertyStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property.isActive = !property.isActive;
    await property.save();

    res.json({
      message: `Property ${
        property.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
