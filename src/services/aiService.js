// src/services/aiService.js
const axios = require('axios');

exports.getAthenaAiResponse = async (userInput, dbMessages) => {
  const aiApiUrl = process.env.PYTHON_AI_API_URL;
  if (!aiApiUrl) {
    throw new Error("PYTHON_AI_API_URL is not configured in .env");
  }

  if (typeof userInput !== 'string' || userInput.trim() === '') {
    throw new Error("userInput must be a non-empty string");
  }

  const MAX_MSGS = 30;
  const history = (Array.isArray(dbMessages) ? dbMessages.slice(-MAX_MSGS) : []).map(msg => ({
    role: msg && msg.sender === 'user' ? 'user' : 'assistant',
    content: String(msg?.text ?? '')
  }));

  const payload = {
    user_input: userInput,
    history
  };

  try {
    console.log("Sending request to Python AI service");
    const fullUrl = `${aiApiUrl}/chat`; 
    const response = await axios.post(fullUrl, payload, {
      timeout: 60000,
      headers: { 'Content-Type': 'application/json' }
    });

    console.log("Received response from Python AI service.");
    return response.data;
  } catch (error) {
    const status = error?.response?.status;
    const snippet = String(error?.response?.data ?? error?.message ?? 'Unknown error').slice(0, 500);
    console.error("Error calling Python AI service:",
      status ? `HTTP ${status}` : '',
      snippet);

    return {
      response: "I'm finding it difficult to process that specific thought. Could you perhaps try rephrasing it? I am still here to listen.",
      sentiment_analysis: {},
      emotion_analysis: {}
    };
  }
};