const User = require('../models/User');
const Hospital = require('../models/Hospital');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register-user
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, phone, address, bloodGroup, dob, lastDonationDate, photo, location } = req.body;
  
  // 1. Data Validation Guard
  if (!name || !email || !password || !phone || !address || !bloodGroup || !dob) {
    return res.status(400).json({ message: 'All required fields must be synchronized (name, email, password, phone, address, bloodGroup, dob).' });
  }

  try {
    // 2. JWT Configuration Check
    if (!process.env.JWT_SECRET) {
        console.error('CRITICAL: JWT_SECRET is not defined in the environment variables!');
        return res.status(500).json({ message: 'Server configuration error. Contact administrator.' });
    }

    // 3. Duplicate Account Check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A node with this identity (email) already exists in the network.' });
    }
    
    // 4. Secure Creation
    const user = await User.create({
      name, 
      email, 
      password, 
      phone, 
      address, 
      bloodGroup, 
      dob: new Date(dob), // Explicitly cast to Date
      lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : null,
      photo, 
      location: location || { type: 'Point', coordinates: [0, 0] }
    });
    
    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'user',
        token: generateToken(user._id, 'user')
      });
    } else {
      return res.status(400).json({ message: 'Initialization failed: Invalid user data received.' });
    }
  } catch (error) {
    // 5. High-Transparency Error Reporting
    console.error('CRITICAL REGISTRATION ERROR:', error);
    
    // Return specific validation error if Mongoose validation failed
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: `Protocol Violation: ${messages.join(', ')}` });
    }

    return res.status(500).json({ message: `Internal Identity Crash: ${error.message}` });
  }
};

// @desc    Login user
// @route   POST /api/auth/login-user
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please sign up first.' });
    }

    const isMatch = await user.matchPassword(password);
    if (isMatch) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: 'user',
        token: generateToken(user._id, 'user')
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials. Please check your password.' });
    }
  } catch (error) {
    console.error('Login User Error:', error);
    res.status(500).json({ message: 'System error during login. Try again later.' });
  }
};

// @desc    Register a new hospital
// @route   POST /api/auth/register-hospital
// @access  Public
const registerHospital = async (req, res) => {
  const { name, email, password, phone, address, logo, location } = req.body;

  // 1. Validation Guard
  if (!name || !email || !password || !phone || !address) {
    return res.status(400).json({ message: 'All required fields must be synchronized (name, email, password, phone, address).' });
  }

  try {
    // 2. JWT Configuration Check
    if (!process.env.JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET is not defined!');
      return res.status(500).json({ message: 'Corporate server configuration error.' });
    }

    // 3. Duplicate Node Check
    const hospitalExists = await Hospital.findOne({ email });
    if (hospitalExists) {
      return res.status(400).json({ message: 'A hospital node with this identity (email) is already active.' });
    }
    
    // 4. Secure Node Initialization
    const hospital = await Hospital.create({
      name, 
      email, 
      password, 
      phone, 
      address, 
      logo, 
      location: location || { type: 'Point', coordinates: [0, 0] }
    });
    
    if (hospital) {
      return res.status(201).json({
        _id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        role: 'hospital',
        token: generateToken(hospital._id, 'hospital')
      });
    } else {
      return res.status(400).json({ message: 'Node initialization failed: Invalid data.' });
    }
  } catch (error) {
    console.error('CRITICAL HOSPITAL REGISTRATION ERROR:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: `Protocol Violation: ${messages.join(', ')}` });
    }

    return res.status(500).json({ message: `Hospital Node Crash: ${error.message}` });
  }
};

// @desc    Login hospital
// @route   POST /api/auth/login-hospital
// @access  Public
const loginHospital = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Corporate email and password required' });
  }

  try {
    if (global.MOCK_MODE && email === 'adh@example.com' && password === 'password123') {
        const { hospitals } = require('../seeders/demoData');
        const hospital = hospitals[0];
        return res.json({
            _id: 'mock_0',
            name: hospital.name,
            email: hospital.email,
            role: 'hospital',
            token: generateToken('mock_0', 'hospital')
        });
    }

    const hospital = await Hospital.findOne({ email });
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital node not found in network.' });
    }

    const isMatch = await hospital.matchPassword(password);
    if (isMatch) {
      res.status(200).json({
        _id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        role: 'hospital',
        token: generateToken(hospital._id, 'hospital')
      });
    } else {
      res.status(401).json({ message: 'Invalid corporate credentials.' });
    }
  } catch (error) {
    console.error('Login Hospital Error:', error);
    res.status(500).json({ message: 'Network sync failure. Try again later.' });
  }
};

module.exports = { registerUser, loginUser, registerHospital, loginHospital };
