const express = require('express');
const router = express.Router();
const candidateController = require('../Controllers/CandidateController');
const { authenticateAdmin } = require('../Middleware/auth');

// Create new candidate
router.post('/', candidateController.createCandidate);

// Log conversation
router.post('/conversation', candidateController.logConversation);

// Get all candidates with optional filters
router.get('/', candidateController.getAllCandidates);

// Get candidate details with conversation history
router.get('/:id', authenticateAdmin, candidateController.getCandidateDetails);

module.exports = router; 