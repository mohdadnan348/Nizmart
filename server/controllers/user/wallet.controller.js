const Wallet = require('../../models/user/Wallet.model');

/**
 * GET MY WALLET
 */
exports.getMyWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user.userId });

    // safety: agar kisi user ka wallet missing ho
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user.userId });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ADD TRANSACTION (ADMIN / SYSTEM)
 * credit / debit
 */
exports.addTransaction = async (req, res) => {
  try {
    const { userId, amount, type, reason, referenceId } = req.body;

    if (!['CREDIT', 'DEBIT'].includes(type)) {
      return res.status(400).json({ message: 'Invalid transaction type' });
    }

    const wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (type === 'DEBIT' && wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // balance update
    wallet.balance =
      type === 'CREDIT'
        ? wallet.balance + amount
        : wallet.balance - amount;

    wallet.transactions.push({
      amount,
      type,
      reason,
      referenceId,
    });

    await wallet.save();

    res.json({
      message: 'Transaction added successfully',
      wallet,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET WALLET BY USER (ADMIN)
 */
exports.getWalletByUser = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.params.userId }).populate(
      'user',
      'name phone'
    );

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
