const mongoose = require('mongoose');

const serviceReviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceBooking',
      required: true,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServicePartner',
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ServiceReview', serviceReviewSchema);
