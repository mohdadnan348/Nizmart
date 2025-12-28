const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    vendorType: {
      type: String,
      enum: [
        'VENUE',
        'DECORATOR',
        'CATERER',
        'PHOTOGRAPHER',
        'MAKEUP_ARTIST',
        'DJ',
        'EVENT_PLANNER',
      ],
      required: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    portfolioImages: [String],

    baseCity: {
      type: String,
      required: true,
    },

    startingPrice: {
      type: Number,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vendor', vendorSchema);
