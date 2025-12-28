const mongoose = require('mongoose');

const eventServiceSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },

    serviceName: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      enum: ['WEDDING', 'BIRTHDAY', 'CORPORATE', 'ANNIVERSARY', 'OTHER'],
      required: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EventService', eventServiceSchema);
