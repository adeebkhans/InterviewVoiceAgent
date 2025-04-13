const { pool } = require('../config/database');
const bodyParser = require('body-parser');

class ConversationController {
    // Create new conversation
    async createConversation(req, res) {
        try {
            const { candidate_id, transcript, entities_extracted } = req.body;
            
            // Ensure entities_extracted is properly stringified
            const entitiesJson = typeof entities_extracted === 'string' 
                ? entities_extracted 
                : JSON.stringify(entities_extracted);

            const [result] = await pool.query(
                'INSERT INTO conversations (candidate_id, transcript, entities_extracted) VALUES (?, ?, ?)',
                [candidate_id, transcript, entitiesJson]
            );

            res.status(201).json({
                success: true,
                data: {
                    conversationId: result.insertId,
                    candidate_id,
                    transcript,
                    entities_extracted
                },
                message: 'Conversation created successfully'
            });

        } catch (error) {
            console.error('Error in createConversation:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating conversation',
                error: error.message
            });
        }
    }

    // Get conversations by candidate ID
    async getConversationsByCandidate(req, res) {
        try {
            const [conversations] = await pool.query(
                'SELECT * FROM conversations WHERE candidate_id = ? ORDER BY created_at DESC',
                [req.params.candidateId]
            );

            const formattedConversations = conversations.map(conv => {
                try {
                    return {
                        ...conv,
                        entities_extracted: typeof conv.entities_extracted === 'string' 
                            ? JSON.parse(conv.entities_extracted)
                            : conv.entities_extracted
                    };
                } catch (err) {
                    console.error(`Error parsing entities for conversation ${conv.id}:`, err);
                    return {
                        ...conv,
                        entities_extracted: {} // Return empty object if parsing fails
                    };
                }
            });

            res.status(200).json({
                success: true,
                data: formattedConversations
            });

        } catch (error) {
            console.error('Error in getConversationsByCandidate:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching conversations',
                error: error.message
            });
        }
    }

    // Get single conversation by ID
    async getConversationById(req, res) {
        try {
            const [conversations] = await pool.query(
                'SELECT * FROM conversations WHERE id = ?',
                [req.params.id]
            );

            if (conversations.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }

            let entities_extracted = {};
            try {
                entities_extracted = typeof conversations[0].entities_extracted === 'string'
                    ? JSON.parse(conversations[0].entities_extracted)
                    : conversations[0].entities_extracted;
            } catch (err) {
                console.error('Error parsing entities:', err);
            }

            const conversation = {
                ...conversations[0],
                entities_extracted
            };

            res.status(200).json({
                success: true,
                data: conversation
            });

        } catch (error) {
            console.error('Error in getConversationById:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching conversation',
                error: error.message
            });
        }
    }

    // Get conversation entities
    async getConversationEntities(req, res) {
        try {
            const [conversations] = await pool.query(
                'SELECT id, entities_extracted FROM conversations WHERE id = ?',
                [req.params.id]
            );

            if (conversations.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }

            let entities = {};
            try {
                entities = typeof conversations[0].entities_extracted === 'string'
                    ? JSON.parse(conversations[0].entities_extracted)
                    : conversations[0].entities_extracted;
            } catch (err) {
                console.error('Error parsing entities:', err);
            }

            res.status(200).json({
                success: true,
                data: {
                    id: conversations[0].id,
                    entities_extracted: entities
                }
            });

        } catch (error) {
            console.error('Error in getConversationEntities:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching conversation entities',
                error: error.message
            });
        }
    }
}

module.exports = new ConversationController(); 