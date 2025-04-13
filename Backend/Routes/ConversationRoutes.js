const express = require('express');
const router = express.Router();
const conversationController = require('../Controllers/ConversationController');
const { authenticateAdmin } = require('../Middleware/auth');

// Create a new conversation
router.post('/', conversationController.createConversation);

// Get all conversations for a specific candidate
router.get('/candidate/:candidateId', authenticateAdmin, conversationController.getConversationsByCandidate);

// Get a specific conversation
router.get('/:id', authenticateAdmin, conversationController.getConversationById);

// Get conversation entities
router.get('/:id/entities', authenticateAdmin, conversationController.getConversationEntities);

module.exports = router; 