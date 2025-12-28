const Match = require('../../models/matrimony/Match.model');
const Interest = require('../../models/matrimony/Interest.model');

/**
 * CREATE MATCH (AUTO / MANUAL)
 */
exports.createMatch = async (req, res) => {
  try {
    const interest = await Interest.findById(req.body.interestId);

    if (!interest || interest.status !== 'ACCEPTED') {
      return res.status(400).json({ message: 'Interest not accepted' });
    }

    const match = await Match.create({
      user1: interest.from,
      user2: interest.to,
      matchedAt: new Date(),
    });

    res.status(201).json({
      message: 'Match created successfully',
      match,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY MATCHES
 */
exports.getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ user1: req.user.userId }, { user2: req.user.userId }],
    }).populate('user1 user2', 'name');

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
