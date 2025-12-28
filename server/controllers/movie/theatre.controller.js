const Theatre = require('../../models/movie/Theatre.model');

/**
 * REGISTER THEATRE (CINEMA OWNER)
 */
exports.registerTheatre = async (req, res) => {
  try {
    const existing = await Theatre.findOne({ owner: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Theatre already registered' });
    }

    const theatre = await Theatre.create({
      owner: req.user.userId,
      theatreName: req.body.theatreName,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      contactNumber: req.body.contactNumber,
      facilities: req.body.facilities || [], // Parking, Snacks, 3D
      isActive: true,
    });

    res.status(201).json({
      message: 'Theatre registered successfully',
      theatre,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL THEATRES (PUBLIC)
 */
exports.getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(theatres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET THEATRE BY ID (PUBLIC)
 */
exports.getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    res.json(theatre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE THEATRE (OWNER)
 */
exports.updateTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findOneAndUpdate(
      { owner: req.user.userId },
      req.body,
      { new: true }
    );

    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    res.json({
      message: 'Theatre updated successfully',
      theatre,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ACTIVATE / DEACTIVATE THEATRE (ADMIN)
 */
exports.toggleTheatreStatus = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return res.status(404).json({ message: 'Theatre not found' });
    }

    theatre.isActive = !theatre.isActive;
    await theatre.save();

    res.json({
      message: `Theatre ${
        theatre.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
