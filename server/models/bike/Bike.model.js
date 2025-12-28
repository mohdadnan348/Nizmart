const mongoose = require('mongoose');

const bikeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BikeOwner',
      required: true,
    },

    bikeType: {
      type: String,
      enum: ['SCOOTER', 'BIKE'],
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    model: {
      type: String,
      required: true,
    },

    engineCC: {
      type: Number,
    },

    pricePerHour: {
      type: Number,
    },

    pricePerDay: {
      type: Number,
    },

    city: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bike', bikeSchema);
