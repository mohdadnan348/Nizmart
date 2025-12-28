const B2BProduct = require('../../models/b2b/B2BProduct.model');
const Company = require('../../models/b2b/Company.model');

/**
 * CREATE B2B PRODUCT (COMPANY OWNER)
 */
exports.createProduct = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user.userId });
    if (!company) {
      return res.status(403).json({ message: 'Company not found' });
    }

    const product = await B2BProduct.create({
      company: company._id,
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      moq: req.body.moq,
      pricePerUnit: req.body.pricePerUnit,
      bulkPricing: req.body.bulkPricing || [],
      customizationAvailable: req.body.customizationAvailable || false,
      leadTimeDays: req.body.leadTimeDays || 0,
    });

    res.status(201).json({
      message: 'B2B product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL B2B PRODUCTS (PUBLIC)
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await B2BProduct.find({ isActive: true })
      .populate('company', 'companyName businessType')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PRODUCTS BY COMPANY (PUBLIC)
 */
exports.getProductsByCompany = async (req, res) => {
  try {
    const products = await B2BProduct.find({
      company: req.params.companyId,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PRODUCT BY ID (PUBLIC)
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await B2BProduct.findById(req.params.id).populate(
      'company',
      'companyName businessType'
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE B2B PRODUCT (COMPANY OWNER)
 */
exports.updateProduct = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user.userId });
    if (!company) {
      return res.status(403).json({ message: 'Company not found' });
    }

    const allowedFields = [
      'name',
      'category',
      'description',
      'moq',
      'pricePerUnit',
      'bulkPricing',
      'customizationAvailable',
      'leadTimeDays',
    ];

    const updateData = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) updateData[f] = req.body[f];
    });

    const product = await B2BProduct.findOneAndUpdate(
      { _id: req.params.id, company: company._id },
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'B2B product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE PRODUCT (COMPANY OWNER)
 */
exports.toggleProductStatus = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user.userId });
    if (!company) {
      return res.status(403).json({ message: 'Company not found' });
    }

    const product = await B2BProduct.findOne({
      _id: req.params.id,
      company: company._id,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.json({
      message: `Product ${
        product.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
