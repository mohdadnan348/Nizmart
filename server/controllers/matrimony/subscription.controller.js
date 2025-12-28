const Subscription = require('../../models/matrimony/Subscription.model');

/**
 * CREATE SUBSCRIPTION
 */
exports.subscribe = async (req, res) => {
  try {
    const subscription = await Subscription.create({
      user: req.user.userId,
      plan: req.body.plan, // BASIC | PREMIUM | GOLD
      price: req.body.price,
      validTill: req.body.validTill,
      status: 'ACTIVE',
    });

    res.status(201).json({
      message: 'Subscription activated successfully',
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY SUBSCRIPTION
 */
exports.getMySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      user: req.user.userId,
      status: 'ACTIVE',
    });

    res.json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
