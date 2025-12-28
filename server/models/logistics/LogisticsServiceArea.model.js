const mongoose = require('mongoose');

const logisticsServiceAreaSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LogisticsCompany',
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'LogisticsServiceArea',
  logisticsServiceAreaSchema
);
