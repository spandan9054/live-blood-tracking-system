const express = require('express');
const router = express.Router();
const { createRequest, getHospitalRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

// Protect routes for User specifically vs Hospital
router.post('/new', protect, createRequest);

// Hospital only protects
router.get('/hospital', protect, getHospitalRequests);
router.patch('/approve/:id', protect, updateRequestStatus);

module.exports = router;
