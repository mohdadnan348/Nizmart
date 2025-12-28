const mongoose = require('mongoose');

const tableBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    numberOfPeople: {
      type: Number,
      required: true,
    },

    specialRequest: String,

    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TableBooking', tableBookingSchema);
