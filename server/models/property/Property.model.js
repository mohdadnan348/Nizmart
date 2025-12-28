const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PropertyOwner',
      required: true,
    },

    propertyType: {
      type: String,
      enum: ['FLAT', 'HOUSE', 'VILLA', 'PLOT', 'OFFICE', 'SHOP', 'WAREHOUSE'],
      required: true,
    },

    listingType: {
      type: String,
      enum: ['BUY', 'SELL', 'RENT', 'LEASE'],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    locality: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    areaSqFt: {
      type: Number,
      required: true,
    },

    bedrooms: Number,
    bathrooms: Number,

    furnishing: {
      type: String,
      enum: ['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'],
    },

    amenities: [String], // Lift, Parking, Security

    images: [String],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
