const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: true,
    },

    seatNumber: {
      type: String, // A1, B5
      required: true,
    },

    seatType: {
      type: String,
      enum: ['SILVER', 'GOLD', 'RECLINER'],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Seat', seatSchema);
