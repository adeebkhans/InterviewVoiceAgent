const { NlpManager } = require('node-nlp');
const { createConversation } = require('./ConversationController');

// Initialize NLP Manager
const manager = new NlpManager({ languages: ['en'], forceNER: true });

// Train the intents
(async () => {
  manager.addDocument('en', 'hello', 'greet');
  manager.addDocument('en', 'hi there', 'greet');
  manager.addDocument('en', 'when are you available', 'ask_for_availability');
  manager.addAnswer('en', 'greet', 'Hello! How can I assist you today?');
  manager.addAnswer('en', 'ask_for_availability', 'When are you available for the interview?');
  await manager.train();
  manager.save();
})();

class VoiceAgentController {
  // Start the voice interaction
  async startVoiceInteraction(req, res) {
    res.status(200).json({ message: 'Voice interaction started' });
  }

  // Handle the voice response
  respondToVoice = async (req, res) => {
    // Log incoming request body
    console.log('Received request body:', req.body);

    // Destructure data from the request body
    const { text, candidate_id } = req.body.audio || {};

    // Check if text or candidate_id is missing
    if (!text || !candidate_id) {
      console.log('Missing required fields: text or candidate_id');
      return res.status(400).json({
        success: false,
        message: 'Text and candidate_id are required.'
      });
    }

    // Process the text using NLP manager
    const response = await manager.process('en', text);
    const intent = response.intent;

    // Log the processed response
    console.log('Processed response:', response);

    // Log the conversation
    try {
        await createConversation({
            body: {
              candidate_id,
              transcript: text,
              entities_extracted: response.entities
            }
          }, {
            status: () => ({ json: () => {} }) // dummy res object
          });
          
      console.log('Conversation created successfully');
    } catch (err) {
      console.error('Error in createConversation:', err.message);
      return res.status(500).json({
        success: false,
        message: 'Error creating conversation'
      });
    }

    // Send the response back
    res.status(200).json({ question: response.answer || 'Could you please repeat that?' });
  };

  extractEntities(transcript) {
    return {}; // Optional: you can use response.entities instead
  }
}

module.exports = new VoiceAgentController();
