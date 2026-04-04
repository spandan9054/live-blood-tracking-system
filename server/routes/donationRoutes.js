const express = require('express');
const router = express.Router();
const { createDonationRequest, acceptDonationRequest, getMyDonations } = require('../controllers/donationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createDonationRequest);
router.put('/accept/:donationId', protect, acceptDonationRequest);
router.get('/my-donations', protect, getMyDonations);

module.exports = router;
