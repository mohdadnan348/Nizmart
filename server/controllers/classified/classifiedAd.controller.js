const ClassifiedAd = require('../../models/classifieds/ClassifiedAd.model');

/**
 * CREATE AD (USER)
 */
exports.createAd = async (req, res) => {
  try {
    const ad = await ClassifiedAd.create({
      user: req.user.userId,
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      city: req.body.city,
      images: req.body.images || [],
      status: 'ACTIVE', // ACTIVE | SOLD | CLOSED
    });

    res.status(201).json({
      message: 'Ad posted successfully',
      ad,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL ADS (PUBLIC)
 */
exports.getAllAds = async (req, res) => {
  try {
    const filters = { status: 'ACTIVE' };

    if (req.query.city) filters.city = req.query.city;
    if (req.query.category) filters.category = req.query.category;

    const ads = await ClassifiedAd.find(filters)
      .populate('category', 'name')
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET AD BY ID (PUBLIC)
 */
exports.getAdById = async (req, res) => {
  try {
    const ad = await ClassifiedAd.findById(req.params.id)
      .populate('category', 'name')
      .populate('user', 'name phone');

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY ADS (USER)
 */
exports.getMyAds = async (req, res) => {
  try {
    const ads = await ClassifiedAd.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });

    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE AD (USER)
 */
exports.updateAd = async (req, res) => {
  try {
    const ad = await ClassifiedAd.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json({
      message: 'Ad updated successfully',
      ad,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * CLOSE / MARK SOLD (USER)
 */
exports.updateAdStatus = async (req, res) => {
  try {
    const ad = await ClassifiedAd.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { status: req.body.status }, // SOLD | CLOSED
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json({
      message: 'Ad status updated successfully',
      ad,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
