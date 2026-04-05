const User = require('../models/User');
const Hospital = require('../models/Hospital');
const Donation = require('../models/Donation');
const { sendEmergencyEmail } = require('../utils/emailService');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const triggerEmergencyAlert = async (req, res) => {
  const { longitude, latitude, bloodGroup, message } = req.body;
  try {
    // Team Error-404 Protocol: 30km radius (30,000 meters)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const usersInRange = await User.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [longitude, latitude] },
          key: 'location',
          distanceField: 'distance',
          maxDistance: 30000,
          spherical: true,
          query: { bloodGroup: bloodGroup } // Filter exact match early on
        }
      },
      {
        $match: {
          $or: [
            { lastDonationDate: null },
            { lastDonationDate: { $lte: ninetyDaysAgo } }
          ]
        }
      }
    ]);
    
    const hospitalsInRange = await Hospital.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 30000
        }
      }
    });

    const emails = [...usersInRange.map(u => u.email), ...hospitalsInRange.map(h => h.email)];
    
    if (emails.length > 0) {
      await sendEmergencyEmail(emails, bloodGroup, message);
    }
    
    res.json({ message: `Team Error-404 Alert Triggered! Reached ${emails.length} eligible contacts within 30km of Asansol.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTestimonials = async (req, res) => {
  try {
    const users = await User.find({}).limit(5).select('name photo');
    const dummyTexts = [
      "SBAN helped me find a donor in minutes. Truly a lifesaver!",
      "The real-time tracking of blood units is a game changer for our city.",
      "A seamless experience for both donors and hospitals alike.",
      "Quick response time and easy to use dashboard.",
      "The emergency alert feature is incredibly useful during critical hours."
    ];
    
    const testimonials = users.map((user, index) => ({
      name: user.name,
      photo: user.photo,
      text: dummyTexts[index % dummyTexts.length]
    }));
    
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserProfile, triggerEmergencyAlert, getTestimonials };
