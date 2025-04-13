const express = require('express');
const router = express.Router();
const voiceAgentController = require('../Controllers/voiceAgentController'); // Ensure this path is correct
const { authenticateAdmin } = require('../Middleware/auth'); // Optional: Protect the route

// Route to start voice interaction
router.post('/start', authenticateAdmin, voiceAgentController.startVoiceInteraction);

// Route to respond to voice input
router.post('/respond', authenticateAdmin, voiceAgentController.respondToVoice);

module.exports = router; 