const express = require('express');
const router = express.Router();
const { getHospitals, updateInventory, getHospitalProfile } = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getHospitals);
router.put('/inventory', protect, authorize('hospital'), updateInventory);
router.get('/profile', protect, authorize('hospital'), getHospitalProfile);

module.exports = router;
