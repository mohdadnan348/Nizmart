const express = require('express');
const router = express.Router();
const multer = require('multer');

const legalDocumentController = require('../../controllers/legal/legalDocument.controller');
const authMiddleware = require('../../middleware/auth/auth.middleware');

// ---------- MULTER CONFIG ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/legal-documents');
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// upload document
router.post(
  '/',
  authMiddleware,
  upload.single('file'),
  legalDocumentController.uploadDocument
);

// get documents by booking
router.get(
  '/booking/:bookingId',
  authMiddleware,
  legalDocumentController.getDocumentsByBooking
);

// delete document
router.delete(
  '/:id',
  authMiddleware,
  legalDocumentController.deleteDocument
);

module.exports = router;
