const mongoose = require('mongoose');

const eventBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EventService',
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    eventCity: {
      type: String,
      required: true,
    },

    advanceAmount: {
      type: Number,
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['BOOKED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
      default: 'BOOKED',
    },

    paymentStatus: {
      type: String,
      enum: ['PENDING', 'ADVANCE_PAID', 'PAID', 'REFUNDED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EventBooking', eventBookingSchema);
