const LogisticsCompany = require('../../models/logistics/LogisticsCompany.model');

/**
 * REGISTER / LIST COMPANY (SELF)
 */
exports.registerCompany = async (req, res) => {
  try {
    const exists = await LogisticsCompany.findOne({ user: req.user.userId });
    if (exists) {
      return res
        .status(400)
        .json({ message: 'Logistics company already listed' });
    }

    const company = await LogisticsCompany.create({
      user: req.user.userId,
      companyName: req.body.companyName,
      city: req.body.city,
      contactNumber: req.body.contactNumber,
      vehicleTypes: req.body.vehicleTypes || [],
      isActive: true,
    });

    res.status(201).json({
      message: 'Logistics company listed successfully',
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
    const company = await LogisticsCompany.findOne({
      user: req.user.userId,
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE MY COMPANY (SELF)
 */
exports.updateMyCompany = async (req, res) => {
  try {
    const company = await LogisticsCompany.findOneAndUpdate(
      { user: req.user.userId },
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
 * GET ALL COMPANIES (PUBLIC)
 */
exports.getAllCompanies = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.city) filter.city = req.query.city;

    const companies = await LogisticsCompany.find(filter).sort({
      createdAt: -1,
    });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * TOGGLE COMPANY STATUS (ADMIN)
 */
exports.toggleCompanyStatus = async (req, res) => {
  try {
    const company = await LogisticsCompany.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    company.isActive = !company.isActive;
    await company.save();

    res.json({
      message: `Company ${
        company.isActive ? 'activated' : 'deactivated'
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
