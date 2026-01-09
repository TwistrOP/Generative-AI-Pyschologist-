// src/routes/chatRoutes.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getChatHistory, sendMessage, getEmotionHistory } = require('../controllers/chatController');

// GET /api/chat/history - Get all messages for all conversations
router.get('/history', authMiddleware, getChatHistory);

// POST /api/chat/send-message - Send a new message
router.post('/send-message', authMiddleware, sendMessage);  

// GET /api/chat/:conversationId/emotions - Get emotion data for a conversation
router.get('/:conversationId/emotions', authMiddleware, getEmotionHistory);

module.exports = router;