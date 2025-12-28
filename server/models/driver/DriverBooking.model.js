const mongoose = require('mongoose');

const driverBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: true,
    },

    pickupLocation: {
      type: String,
      required: true,
    },

    dropLocation: {
      type: String,
    },

    bookingDateTime: {
      type: Date,
      required: true,
    },

    durationType: {
      type: String,
      enum: ['HOURLY', 'DAILY', 'OUTSTATION', 'NIGHT'],
      required: true,
    },

    durationValue: {
      type: Number, // hours / days
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['BOOKED', 'ON_TRIP', 'COMPLETED', 'CANCELLED'],
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

module.exports = mongoose.model('DriverBooking', driverBookingSchema);
