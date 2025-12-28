const mongoose = require('mongoose');

const classifiedAdSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassifiedCategory',
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    isNegotiable: {
      type: Boolean,
      default: true,
    },

    city: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'SOLD', 'EXPIRED', 'BLOCKED'],
      default: 'ACTIVE',
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClassifiedAd', classifiedAdSchema);
