const mongoose = require('mongoose');

const propertyOwnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    ownerType: {
      type: String,
      enum: ['OWNER', 'AGENT', 'BUILDER'],
      default: 'OWNER',
    },

    reraNumber: {
      type: String, // mainly for agent / builder
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PropertyOwner', propertyOwnerSchema);
