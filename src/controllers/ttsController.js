// src/controllers/ttsController.js
const { ElevenLabsClient } = require("elevenlabs");

const client = new ElevenLabsClient({
 apiKey: process.env.ELEVENLABS_API_KEY,
});

exports.synthesizeSpeech = async (req, res) => {
 const { text } = req.body;


 if (!text) {
   return res.status(400).json({ message: 'Text is required' });
 }


 try {
   const audio = await client.generate({
     voice: "ROMJ9yK1NAMuu1ggrjDW", 
     text: text,
     model_id: 'eleven_multilingual_v2',
   });


   const chunks = [];
   for await (const chunk of audio) {
     chunks.push(chunk);
   }
   const content = Buffer.concat(chunks);


   res.json({ audioContent: content.toString('base64') });


 } catch (error) {
   console.error('ERROR synthesizing speech with ElevenLabs:', error);
   res.status(500).send('Failed to synthesize speech');
 }
};
