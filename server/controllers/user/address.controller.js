const Address = require('../../models/user/Address.model');

/**
 * ADD ADDRESS (USER)
 */
exports.addAddress = async (req, res) => {
  try {
    const addressData = {
      user: req.user.userId,
      ...req.body,
    };

    // agar is address ko default bana rahe ho
    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user.userId },
        { isDefault: false }
      );
    }

    const address = await Address.create(addressData);

    res.status(201).json({
      message: 'Address added successfully',
      address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY ADDRESSES
 */
exports.getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.userId }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE ADDRESS
 */
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // default address logic
    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.user.userId },
        { isDefault: false }
      );
    }

    Object.assign(address, req.body);
    await address.save();

    res.json({
      message: 'Address updated successfully',
      address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE ADDRESS
 */
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
