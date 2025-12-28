const ProductVariant = require('../../models/retail/ProductVariant.model');
const Product = require('../../models/retail/Product.model');
const Seller = require('../../models/retail/Seller.model');

/**
 * CREATE VARIANT (SELLER)
 */
exports.createVariant = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.userId });
    if (!seller) {
      return res.status(403).json({ message: 'Seller not found' });
    }

    const { product, size, color, price, stock } = req.body;

    const parentProduct = await Product.findOne({
      _id: product,
      seller: seller._id,
    });

    if (!parentProduct) {
      return res
        .status(404)
        .json({ message: 'Product not found or not owned by seller' });
    }

    const variant = await ProductVariant.create({
      product,
      size,
      color,
      price,
      stock,
    });

    res.status(201).json({
      message: 'Product variant created successfully',
      variant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET VARIANTS BY PRODUCT (PUBLIC)
 */
exports.getVariantsByProduct = async (req, res) => {
  try {
    const variants = await ProductVariant.find({
      product: req.params.productId,
    }).sort({ createdAt: -1 });

    res.json(variants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE VARIANT (SELLER)
 */
exports.updateVariant = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.userId });
    if (!seller) {
      return res.status(403).json({ message: 'Seller not found' });
    }

    const variant = await ProductVariant.findById(req.params.id).populate(
      'product'
    );

    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    if (variant.product.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const allowedFields = ['size', 'color', 'price', 'stock'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        variant[field] = req.body[field];
      }
    });

    await variant.save();

    res.json({
      message: 'Product variant updated successfully',
      variant,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE VARIANT (SELLER)
 */
exports.deleteVariant = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user.userId });
    if (!seller) {
      return res.status(403).json({ message: 'Seller not found' });
    }

    const variant = await ProductVariant.findById(req.params.id).populate(
      'product'
    );

    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    if (variant.product.seller.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await variant.deleteOne();

    res.json({ message: 'Product variant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
