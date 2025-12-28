const LegalDocument = require('../../models/legal/LegalDocument.model');
const LegalBooking = require('../../models/legal/LegalBooking.model');
const Advocate = require('../../models/legal/Advocate.model');

/**
 * UPLOAD LEGAL DOCUMENT (USER / ADVOCATE)
 * Linked to a LegalBooking
 */
exports.uploadDocument = async (req, res) => {
  try {
    const { bookingId, title, type } = req.body;
    // type: CASE_FILE | EVIDENCE | PDF | OTHER

    const booking = await LegalBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Legal booking not found' });
    }

    // access control: user or advocate of this booking
    const advocate = await Advocate.findOne({ user: req.user.userId });
    const isUser = booking.user.toString() === req.user.userId;
    const isAdvocate =
      advocate && booking.advocate.toString() === advocate._id.toString();

    if (!isUser && !isAdvocate) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document = await LegalDocument.create({
      booking: bookingId,
      uploadedBy: isUser ? 'USER' : 'ADVOCATE',
      uploader: req.user.userId,
      title,
      type,
      fileName: req.file.originalname,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    res.status(201).json({
      message: 'Document uploaded successfully',
      document,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET DOCUMENTS BY BOOKING (USER / ADVOCATE)
 */
exports.getDocumentsByBooking = async (req, res) => {
  try {
    const booking = await LegalBooking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Legal booking not found' });
    }

    // access control
    const advocate = await Advocate.findOne({ user: req.user.userId });
    const isUser = booking.user.toString() === req.user.userId;
    const isAdvocate =
      advocate && booking.advocate.toString() === advocate._id.toString();

    if (!isUser && !isAdvocate) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const documents = await LegalDocument.find({
      booking: req.params.bookingId,
    }).sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE DOCUMENT (UPLOADER / ADMIN)
 */
exports.deleteDocument = async (req, res) => {
  try {
    const document = await LegalDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // only uploader can delete (admin middleware can be added later)
    if (document.uploader.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    await document.deleteOne();

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
