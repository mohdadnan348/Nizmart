const Product = require('../../models/retail/Product.model');
const ProductCategory = require('../../models/retail/ProductCategory.model');
const Seller = require('../../models/retail/Seller.model');

/**
 * CREATE PRODUCT (SELLER)
 */
exports.createProduct = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.userId });
    if (!seller) {
      return res.status(403).json({ message: 'Seller not found' });
    }

    const category = await ProductCategory.findById(req.body.category);
    if (!category || !category.isActive) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const product = await Product.create({
      seller: seller._id,
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      description: req.body.description,
      price: req.body.price,
      discount: req.body.discount || 0,
      stock: req.body.stock || 0,
      images: req.body.images || [],
    });

    res.status(201).json({
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL PRODUCTS (PUBLIC)
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('category', 'name')
      .populate('seller', 'shopName')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET PRODUCTS BY CATEGORY (PUBLIC)
 */
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
      isActive: true,
    })
      .populate('seller', 'shopName')
      .sort({ createdAt: -1 });

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
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('seller', 'shopName');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PRODUCT (SELLER)
 */
exports.updateProduct = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.userId });
    if (!seller) {
      return res.status(403).json({ message: 'Seller not found' });
    }

    // allowed fields only
    const updateData = {};
    const allowedFields = [
      'name',
      'brand',
      'description',
      'price',
      'discount',
      'stock',
      'images',
      'category',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (updateData.category) {
      const category = await ProductCategory.findById(updateData.category);
      if (!category || !category.isActive) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: seller._id },
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE PRODUCT (SELLER)
 */
exports.toggleProductStatus = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.userId });
    if (!seller) {
      return res.status(403).json({ message: 'Seller not found' });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      seller: seller._id,
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
