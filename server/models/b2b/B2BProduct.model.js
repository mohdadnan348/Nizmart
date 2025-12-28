const mongoose = require('mongoose');

const b2bProductSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    category: String,

    description: String,

    moq: {
      type: Number,
      required: true,
    },

    pricePerUnit: {
      type: Number,
      required: true,
    },

    bulkPricing: [
      {
        minQty: Number,
        maxQty: Number,
        price: Number,
      },
    ],

    customizationAvailable: {
      type: Boolean,
      default: false,
    },

    leadTimeDays: {
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

module.exports = mongoose.model('B2BProduct', b2bProductSchema);
