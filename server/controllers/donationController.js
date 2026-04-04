const Donation = require('../models/Donation');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const { sendDonationConfirmationEmail } = require('../utils/emailService');

const createDonationRequest = async (req, res) => {
  const { hospitalId } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Check 100-day cooldown
    if (user.lastDonationDate) {
      const diffTime = Math.abs(new Date() - user.lastDonationDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 100) {
        return res.status(400).json({ message: `You must wait ${100 - diffDays} more days before your next donation.` });
      }
    }
    
    const donation = await Donation.create({
      user: req.user._id,
      hospital: hospitalId,
      status: 'Pending'
    });
    
    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const acceptDonationRequest = async (req, res) => {
  const { donationId } = req.params;
  try {
    const donation = await Donation.findById(donationId).populate('user').populate('hospital');
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    
    if (donation.hospital._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized for this hospital' });
    }
    
    donation.status = 'Accepted';
    await donation.save();
    
    // Update user's lastDonationDate to today
    const user = await User.findById(donation.user._id);
    user.lastDonationDate = new Date();
    await user.save();
    
    // Send notification email
    await sendDonationConfirmationEmail(user.email, donation.hospital.name);
    
    res.json({ message: 'Donation accepted, user updated, and email sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyDonations = async (req, res) => {
  try {
    let query = req.role === 'user' ? { user: req.user._id } : { hospital: req.user._id };
    const donations = await Donation.find(query).populate('user hospital');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDonationRequest, acceptDonationRequest, getMyDonations };
