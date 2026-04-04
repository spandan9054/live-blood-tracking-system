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
    // 50km = 50,000 meters
    const usersInRange = await User.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 50000
        }
      },
      bloodGroup: bloodGroup
    });
    
    const hospitalsInRange = await Hospital.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 50000
        }
      }
    });

    const emails = [...usersInRange.map(u => u.email), ...hospitalsInRange.map(h => h.email)];
    
    if (emails.length > 0) {
      // Send emails (simulate in test mode if needed)
      await sendEmergencyEmail(emails, bloodGroup, message);
    }
    
    res.json({ message: `Emergency alert triggered to ${emails.length} contacts within 50km radius.` });
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
