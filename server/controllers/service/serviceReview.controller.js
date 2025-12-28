const ServiceReview = require('../../models/service/ServiceReview.model');
const ServiceBooking = require('../../models/service/ServiceBooking.model');
const ServicePartner = require('../../models/service/ServicePartner.model');

/**
 * ADD REVIEW (USER) – only after COMPLETED booking
 */
exports.addReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await ServiceBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (booking.status !== 'COMPLETED') {
      return res
        .status(400)
        .json({ message: 'Review allowed only after service completion' });
    }

    const existingReview = await ServiceReview.findOne({
      booking: bookingId,
    });
    if (existingReview) {
      return res.status(400).json({ message: 'Review already submitted' });
    }

    const review = await ServiceReview.create({
      booking: bookingId,
      user: req.user.userId,
      partner: booking.partner,
      rating,
      comment,
    });

    // update partner rating
    const partner = await ServicePartner.findById(booking.partner);
    if (partner) {
      const allReviews = await ServiceReview.find({
        partner: partner._id,
      });

      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) /
        allReviews.length;

      partner.rating = avgRating.toFixed(1);
      partner.totalJobs += 1;
      await partner.save();
    }

    res.status(201).json({
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET REVIEWS BY PARTNER (PUBLIC)
 */
exports.getReviewsByPartner = async (req, res) => {
  try {
    const reviews = await ServiceReview.find({
      partner: req.params.partnerId,
    })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET REVIEWS BY USER
 */
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await ServiceReview.find({
      user: req.user.userId,
    })
      .populate('partner')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
