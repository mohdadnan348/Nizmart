const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    language: {
      type: String, // Hindi, English, Telugu etc.
      required: true,
    },

    genre: [String], // Action, Comedy, Drama

    durationMinutes: {
      type: Number,
      required: true,
    },

    releaseDate: {
      type: Date,
    },

    poster: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
