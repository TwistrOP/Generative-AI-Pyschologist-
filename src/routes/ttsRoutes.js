// src/routes/ttsRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { synthesizeSpeech } = require('../controllers/ttsController');

router.post('/synthesize', authMiddleware, synthesizeSpeech);

module.exports = router;