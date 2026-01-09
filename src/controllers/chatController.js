// src/controllers/chatController.js
const { Conversation, Message } = require('../models');
const { getAthenaAiResponse } = require('../services/aiService');

exports.getChatHistory = async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Message,
        as: 'messages',
      }],
      order: [['updatedAt', 'DESC']]
    });
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    res.status(500).send('Server Error');
  }
};

exports.sendMessage = async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;

  if (!text || text.trim() === '') {
    return res.status(400).json({ msg: 'Message text cannot be empty' });
  }

  try {
    console.log(`INFO: sendMessage triggered for user ${userId}. Message: "${text}"`);

    const [conversation] = await Conversation.findOrCreate({
        where: { userId: userId, id: req.body.conversationId || null }, // Use existing or create new
        defaults: { userId: userId }
    });
    
    const existingMessages = await Message.findAll({
      where: { conversationId: conversation.id },
      order: [['createdAt', 'ASC']],
      limit: 20,
    });
    
    console.log("INFO: Calling AI service getAthenaAiResponse...");
    const aiResult = await getAthenaAiResponse(text, existingMessages);
    
    await Message.create({
      sender: 'user',
      text: text,
      conversationId: conversation.id,
      emotionData: aiResult?.analysis?.emotions || null,  
    });

    if (aiResult && aiResult.response) {
      await Message.create({
        sender: 'bot',
        text: aiResult.response,
        conversationId: conversation.id,
      });
    }
    
    await conversation.changed('updatedAt', true);
    await conversation.save();

    res.status(200).json(aiResult);

  } catch (error) {
    console.error("--- !!! ERROR in sendMessage controller !!! ---");
    console.error("Error Message:", error.message);

    if (error.response) {
      console.error("Response Data from AI Service:", error.response.data);
      console.error("Response Status from AI Service:", error.response.status);
    } else if (error.request) {
      console.error("No response received from AI service. Request details:", error.request);
    }

    console.error("--- END OF ERROR ---");
    res.status(500).send('Server Error');
  }
};

exports.getEmotionHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.findAll({
      where: {
        conversationId: conversationId,
        sender: 'user'  
      },
      attributes: ['createdAt', 'emotionData'],
      order: [['createdAt', 'ASC']]
    });

    const emotionHistory = messages
      .filter(msg => msg.emotionData && msg.emotionData.length > 0)
      .map(msg => ({
        timestamp: msg.createdAt,
        emotions: msg.emotionData,
      }));

    res.json(emotionHistory);

  } catch (error) {
    console.error("Error fetching emotion history:", error.message);
    res.status(500).send('Server Error');
  }
};