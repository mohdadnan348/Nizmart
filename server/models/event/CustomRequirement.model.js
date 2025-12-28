const mongoose = require('mongoose');

const customRequirementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    eventType: {
      type: String,
      enum: ['WEDDING', 'BIRTHDAY', 'CORPORATE', 'OTHER'],
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    budgetRange: {
      type: String,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ['OPEN', 'QUOTATION_RECEIVED', 'CLOSED'],
      default: 'OPEN',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomRequirement', customRequirementSchema);
