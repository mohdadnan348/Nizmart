const mongoose = require('mongoose');

const classifiedImageSchema = new mongoose.Schema(
  {
    ad: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClassifiedAd',
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'ClassifiedImage',
  classifiedImageSchema
);
