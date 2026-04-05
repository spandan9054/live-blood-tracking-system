const Hospital = require('../models/Hospital');

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
const getHospitals = async (req, res) => {
  try {
    if (global.MOCK_MODE) {
        const { hospitals } = require('../seeders/demoData');
        const hospitalsWithIds = hospitals.map((h, i) => ({ ...h, _id: `mock_${i}` }));
        return res.json(hospitalsWithIds);
    }

    const { lng, lat } = req.query;
    if (lng && lat) {
      try {
        const hospitals = await Hospital.aggregate([
          {
            $geoNear: {
              near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
              key: 'location',
              distanceField: 'distance',
              maxDistance: 50000,
              spherical: true
            }
          }
        ]);
        return res.json(hospitals);
      } catch (geoError) {
        console.error('GeoNear Index Mapping Failed, initiating structural fallback:', geoError.message);
        // Fallback to standard list extraction below if the spatial grid drops
      }
    }

    const hospitals = await Hospital.find({}).select('-password');
    res.json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update inventory
// @route   PUT /api/hospitals/inventory
// @access  Private (Hospital only)
const updateInventory = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.user._id);
    if (hospital) {
      hospital.inventory = req.body.inventory || hospital.inventory;
      const updatedHospital = await hospital.save();
      res.json(updatedHospital.inventory);
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory (profile)
// @route   GET /api/hospitals/profile
// @access  Private (Hospital only)
const getHospitalProfile = async (req, res) => {
  try {
    if (global.MOCK_MODE && req.user.id === 'mock_0') {
        const { hospitals } = require('../seeders/demoData');
        const hospital = hospitals[0];
        return res.json({ ...hospital, _id: 'mock_0' });
    }
    const hospital = await Hospital.findById(req.user._id).select('-password');
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getHospitals, updateInventory, getHospitalProfile };
