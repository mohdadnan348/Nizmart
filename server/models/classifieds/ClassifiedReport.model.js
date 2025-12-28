const mongoose = require('mongoose');

const classifiedReportSchema = new mongoose.Schema(
  {
    ad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassifiedAd',
      required: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['OPEN', 'RESOLVED', 'REJECTED'],
      default: 'OPEN',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'ClassifiedReport',
  classifiedReportSchema
);
