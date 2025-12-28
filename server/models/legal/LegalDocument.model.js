const mongoose = require('mongoose');

const legalDocumentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LegalBooking',
      required: true,
    },

    documentType: {
      type: String, // Agreement, Notice, Affidavit, Will
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: String,
      enum: ['USER', 'ADVOCATE'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LegalDocument', legalDocumentSchema);
