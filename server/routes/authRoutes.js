const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerHospital, loginHospital } = require('../controllers/authController');

router.post('/register-user', registerUser);
router.post('/login-user', loginUser);
router.post('/register-hospital', registerHospital);
router.post('/login-hospital', loginHospital);

module.exports = router;
