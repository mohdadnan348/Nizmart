const mongoose = require('mongoose');

const advocateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    practiceAreas: [
      {
        type: String, // Criminal, Civil, Family, Property, GST, IPR
      },
    ],

    experienceYears: {
      type: Number,
      default: 0,
    },

    courtName: {
      type: String,
    },

    consultationFee: {
      type: Number,
      required: true,
    },

    barCouncilId: {
      type: String,
      required: true,
      unique: true,
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

module.exports = mongoose.model('Advocate', advocateSchema);
