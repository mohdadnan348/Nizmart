const Company = require('../../models/b2b/Company.model');

/**
 * REGISTER COMPANY (SELF)
 */
exports.registerCompany = async (req, res) => {
  try {
    const existing = await Company.findOne({ owner: req.user.userId });
    if (existing) {
      return res.status(400).json({ message: 'Company already registered' });
    }

    const company = await Company.create({
      owner: req.user.userId,
      companyName: req.body.companyName,
      businessType: req.body.businessType,
      gstNumber: req.body.gstNumber,
      panNumber: req.body.panNumber,
      address: req.body.address,
    });

    res.status(201).json({
      message: 'Company registered successfully',
      company,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET MY COMPANY (SELF)
 */
exports.getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ owner: req.user.userId });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL COMPANIES (PUBLIC / ADMIN)
 */
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isVerified: true }).sort({
      createdAt: -1,
    });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET COMPANY BY ID (PUBLIC)
 */
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE COMPANY (SELF)
 */
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { owner: req.user.userId },
      req.body,
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({
      message: 'Company updated successfully',
      company,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * VERIFY / UNVERIFY COMPANY (ADMIN)
 */
exports.toggleVerification = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.isVerified = !company.isVerified;
    await company.save();

    res.json({
      message: `Company ${
        company.isVerified ? 'verified' : 'unverified'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
