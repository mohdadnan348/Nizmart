const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    businessType: {
      type: String,
      enum: ['MANUFACTURER', 'WHOLESALER', 'DISTRIBUTOR'],
      required: true,
    },

    gstNumber: String,
    panNumber: String,

    address: {
      type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);
