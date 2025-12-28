const ClassifiedReport = require('../../models/classifieds/ClassifiedReport.model');

/**
 * REPORT AD (USER)
 */
exports.reportAd = async (req, res) => {
  try {
    const report = await ClassifiedReport.create({
      ad: req.body.adId,
      reportedBy: req.user.userId,
      reason: req.body.reason,
      description: req.body.description,
      status: 'OPEN',
    });

    res.status(201).json({
      message: 'Ad reported successfully',
      report,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL REPORTS (ADMIN)
 */
exports.getReports = async (req, res) => {
  try {
    const reports = await ClassifiedReport.find()
      .populate('ad', 'title')
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
