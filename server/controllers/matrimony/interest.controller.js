const Interest = require('../../models/matrimony/Interest.model');

/**
 * SEND INTEREST
 */
exports.sendInterest = async (req, res) => {
  try {
    const interest = await Interest.create({
      from: req.user.userId,
      to: req.body.toUserId,
      status: 'PENDING',
    });

    res.status(201).json({
      message: 'Interest sent successfully',
      interest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY RECEIVED INTERESTS
 */
exports.getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      to: req.user.userId,
    }).populate('from', 'name');

    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE INTEREST STATUS
 */
exports.updateInterestStatus = async (req, res) => {
  try {
    const { status } = req.body; // ACCEPTED | REJECTED

    const interest = await Interest.findOneAndUpdate(
      { _id: req.params.id, to: req.user.userId },
      { status },
      { new: true }
    );

    if (!interest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    res.json({
      message: 'Interest updated successfully',
      interest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
