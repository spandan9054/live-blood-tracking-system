const express = require('express');
const router = express.Router();
const { getUserProfile, triggerEmergencyAlert, getTestimonials } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/profile', protect, authorize('user'), getUserProfile);
router.post('/emergency', triggerEmergencyAlert);
router.get('/testimonials', getTestimonials);

module.exports = router;
