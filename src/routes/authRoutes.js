// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
// Import middleware
const authMiddleware = require('../middleware/authMiddleware');
const { register, login, getMe } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);  

router.get('/me', authMiddleware, getMe);

module.exports = router;