const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    rfq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RFQ',
      required: true,
    },

    sellerCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    deliveryTimeDays: {
      type: Number,
      required: true,
    },

    validityDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['SENT', 'ACCEPTED', 'REJECTED'],
      default: 'SENT',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quotation', quotationSchema);
