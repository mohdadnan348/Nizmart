const mongoose = require('mongoose');

const legalBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    advocate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Advocate',
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LegalService',
      required: true,
    },

    caseDescription: {
      type: String,
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'BOOKED',
    },

    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'REFUNDED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LegalBooking', legalBookingSchema);
