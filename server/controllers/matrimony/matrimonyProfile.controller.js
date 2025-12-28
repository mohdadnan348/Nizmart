const MatrimonyProfile = require('../../models/matrimony/MatrimonyProfile.model');

/**
 * CREATE / UPDATE PROFILE (SELF)
 */
exports.upsertProfile = async (req, res) => {
  try {
    const profile = await MatrimonyProfile.findOneAndUpdate(
      { user: req.user.userId },
      {
        user: req.user.userId,
        ...req.body,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    res.json({
      message: 'Matrimony profile saved successfully',
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY PROFILE
 */
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await MatrimonyProfile.findOne({
      user: req.user.userId,
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * BROWSE PROFILES (PUBLIC / FILTERED)
 */
exports.browseProfiles = async (req, res) => {
  try {
    const filters = { isActive: true };

    if (req.query.gender) filters.gender = req.query.gender;
    if (req.query.city) filters.city = req.query.city;
    if (req.query.religion) filters.religion = req.query.religion;

    const profiles = await MatrimonyProfile.find(filters)
      .select('-contactDetails')
      .sort({ createdAt: -1 });

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
