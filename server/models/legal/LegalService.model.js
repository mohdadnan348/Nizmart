const mongoose = require('mongoose');

const legalServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String, // Documentation, Consultation, Corporate, Property, Family
      required: true,
    },

    description: {
      type: String,
    },

    basePrice: {
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

module.exports = mongoose.model('LegalService', legalServiceSchema);
