const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
    },

    consultationType: {
      type: String,
      enum: ['VIDEO', 'AUDIO', 'CHAT'],
      required: true,
    },

    notes: {
      type: String,
    },

    prescription: {
      type: String,
    },

    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Consultation', consultationSchema);
