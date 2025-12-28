const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    hotelType: {
      type: String,
      enum: ['HOTEL', 'RESORT', 'HOMESTAY', 'VILLA'],
      default: 'HOTEL',
    },

    city: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    amenities: [String], // Wifi, AC, Pool, Parking

    rating: {
      type: Number,
      default: 0,
    },

    checkInTime: {
      type: String,
      default: '12:00',
    },

    checkOutTime: {
      type: String,
      default: '11:00',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);
