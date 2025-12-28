const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: [
        'USER',
        'ADMIN',
        'SERVICE_PARTNER',
        'SELLER',
        'RESTAURANT',
        'DOCTOR',
        'ADVOCATE',
        'VENDOR',
        'HOTEL',
        'DRIVER',
        'BIKE_OWNER',
        'PROPERTY_OWNER',
        'MANUFACTURER',
        'CINEMA_OWNER',
        'LOGISTICS_COMPANY',
      ],
    },

    description: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
