const mongoose = require('mongoose');

const logisticsCompanySchema = new mongoose.Schema(
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

    companyType: {
      type: String,
      enum: ['COURIER', 'FREIGHT', 'LOCAL_DELIVERY', 'B2B_LOGISTICS'],
      required: true,
    },

    contactPerson: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    gstNumber: {
      type: String,
    },

    website: {
      type: String,
    },

    address: {
      type: String,
      required: true,
    },

    services: [
      {
        type: String,
        enum: [
          'SAME_DAY',
          'NEXT_DAY',
          'EXPRESS',
          'BULK',
          'INTERNATIONAL',
        ],
      },
    ],

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'LogisticsCompany',
  logisticsCompanySchema
);
