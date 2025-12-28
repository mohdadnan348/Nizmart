const mongoose = require('mongoose');

const b2bOrderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    sellerCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'B2BProduct',
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    orderType: {
      type: String,
      enum: ['DIRECT', 'NEGOTIATION'],
      default: 'DIRECT',
    },

    status: {
      type: String,
      enum: ['PLACED', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED',
    },

    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('B2BOrder', b2bOrderSchema);
