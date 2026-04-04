const DonationRequest = require('../models/DonationRequest');
const User = require('../models/User');

// @desc    Create a new donation request
// @route   POST /api/requests/new
// @access  Private
const createRequest = async (req, res) => {
  try {
    const { hospitalId, name, email, phone, address, gender, medicalHistory, bloodGroup } = req.body;

    if (!hospitalId || !name || !email || !phone || !gender || !bloodGroup) {
      return res.status(400).json({ message: 'Missing core payload data.' });
    }

    const request = await DonationRequest.create({
      hospital: hospitalId,
      user: req.user._id, // Sourced from protect middleware
      name,
      email,
      phone,
      address,
      gender,
      medicalHistory: medicalHistory || 'No specific conditions reported.',
      bloodGroup
    });

    res.status(201).json({ message: 'Donation Request dispatched successfully.', request });
  } catch (error) {
    console.error('Create Request Error:', error);
    res.status(500).json({ message: 'Failed to dispatch request due to planetary network error.' });
  }
};

// @desc    Get all active requests for a specific hospital
// @route   GET /api/requests/hospital
// @access  Private (Hospital Only)
const getHospitalRequests = async (req, res) => {
  try {
    // req.user holds the hospital entity in the protect middleware
    const requests = await DonationRequest.find({ hospital: req.user._id })
      .populate('user', 'name email dob bloodGroup lastDonationDate')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error('Get Requests Error:', error);
    res.status(500).json({ message: 'Server topology error while fetching active requests.' });
  }
};

// @desc    Approve/Reject a request
// @route   PATCH /api/requests/:id
// @access  Private (Hospital Only)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    const requestId = req.params.id;

    if (!['Accepted', 'Rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid state machine signal.' });
    }

    const donationReq = await DonationRequest.findById(requestId);
    
    if (!donationReq) {
        return res.status(404).json({ message: 'Request node missing.' });
    }

    // Ensure only the node owner can approve (using req.user mapped by protect payload)
    if (donationReq.hospital.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden Action.' });
    }

    donationReq.status = status;
    await donationReq.save();

    // The Magic Trigger: If Accepted, we Reset the Donor's Last Donation Date!!
    if (status === 'Accepted') {
        const user = await User.findById(donationReq.user);
        if (user) {
            user.lastDonationDate = Date.now();
            await user.save();
        }
    }

    res.status(200).json({ message: `Request successfully marked as ${status}.` });

  } catch (error) {
    console.error('Update Request Error:', error);
    res.status(500).json({ message: 'Error enforcing status update.' });
  }
};

module.exports = {
  createRequest,
  getHospitalRequests,
  updateRequestStatus
};
