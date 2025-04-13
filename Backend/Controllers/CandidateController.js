const { pool } = require('../config/database');

class CandidateController {
    // Create new candidate
    async createCandidate(req, res) {
        try {
            const { name, phone, current_ctc, expected_ctc, notice_period, experience } = req.body;
            
            const [result] = await pool.query(
                'INSERT INTO candidates (name, phone, current_ctc, expected_ctc, notice_period, experience) VALUES (?, ?, ?, ?, ?, ?)',
                [name, phone, current_ctc, expected_ctc, notice_period, experience]
            );

            res.status(201).json({
                success: true,
                data: {
                    id: result.insertId,
                    name,
                    phone,
                    current_ctc,
                    expected_ctc,
                    notice_period,
                    experience
                },
                message: 'Candidate created successfully'
            });

        } catch (error) {
            console.error('Error in createCandidate:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating candidate',
                error: error.message
            });
        }
    }

    // Get all candidates
    async getAllCandidates(req, res) {
        try {
            const { experience_min, experience_max, ctc_min, ctc_max, notice_period } = req.query;

            // Build the query dynamically based on provided filters
            let query = 'SELECT * FROM candidates WHERE 1=1'; // Start with a base query
            const params = [];

            if (experience_min) {
                query += ' AND experience >= ?';
                params.push(experience_min);
            }
            if (experience_max) {
                query += ' AND experience <= ?';
                params.push(experience_max);
            }
            if (ctc_min) {
                query += ' AND current_ctc >= ?';
                params.push(ctc_min);
            }
            if (ctc_max) {
                query += ' AND current_ctc <= ?';
                params.push(ctc_max);
            }
            if (notice_period) {
                query += ' AND notice_period = ?';
                params.push(notice_period);
            }

            const [candidates] = await pool.query(query, params);
            
            res.json({
                success: true,
                data: candidates
            });

        } catch (error) {
            console.error('Error in getAllCandidates:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching candidates',
                error: error.message
            });
        }
    }

    // Get candidate by ID with their conversations
    async getCandidateDetails(req, res) {
        try {
            const [candidates] = await pool.query(`
                SELECT 
                    c.*,
                    JSON_ARRAYAGG(
                        IF(conv.id IS NOT NULL,
                            JSON_OBJECT(
                                'id', conv.id,
                                'transcript', conv.transcript,
                                'entities_extracted', conv.entities_extracted,
                                'created_at', conv.created_at
                            ),
                            NULL
                        )
                    ) as conversations
                FROM candidates c
                LEFT JOIN conversations conv ON c.id = conv.candidate_id
                WHERE c.id = ?
                GROUP BY c.id
            `, [req.params.id]);

            if (candidates.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Candidate not found'
                });
            }

            let parsedConversations = [];
            if (candidates[0].conversations && candidates[0].conversations[0] !== null) {
                parsedConversations = candidates[0].conversations.map(conv => {
                    let parsedEntities = {};
                    try {
                        parsedEntities = typeof conv.entities_extracted === 'string' 
                            ? JSON.parse(conv.entities_extracted)
                            : conv.entities_extracted;
                    } catch (err) {
                        console.error('Error parsing entities:', err);
                        parsedEntities = {};
                    }

                    return {
                        ...conv,
                        entities_extracted: parsedEntities
                    };
                });
            }

            const candidate = {
                ...candidates[0],
                conversations: parsedConversations
            };

            res.json({
                success: true,
                data: candidate
            });

        } catch (error) {
            console.error('Error in getCandidateDetails:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching candidate details',
                error: error.message
            });
        }
    }

    // Log conversation
    async logConversation(req, res) {
        try {
            const { candidate_id, message, message_type } = req.body;

            const [result] = await pool.query(
                'INSERT INTO conversation_logs (candidate_id, message, message_type) VALUES (?, ?, ?)',
                [candidate_id, message, message_type]
            );

            res.status(201).json({
                success: true,
                data: { logId: result.insertId },
                message: 'Conversation logged successfully'
            });

        } catch (error) {
            console.error('Error in logConversation:', error);
            res.status(500).json({
                success: false,
                message: 'Error logging conversation',
                error: error.message
            });
        }
    }

    // Update candidate status
    async updateCandidateStatus(req, res) {
        try {
            const { status } = req.body;

            const [result] = await pool.query(
                'UPDATE candidates SET status = ? WHERE id = ?',
                [status, req.params.id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Candidate not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Candidate status updated successfully'
            });

        } catch (error) {
            console.error('Error in updateCandidateStatus:', error);
            res.status(500).json({
                success: false,
                message: 'Error updating candidate status',
                error: error.message
            });
        }
    }

    async getCandidateById(req, res) {
        try {
            const [candidates] = await pool.query(
                'SELECT * FROM candidates WHERE id = ?',
                [req.params.id]
            );

            if (candidates.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Candidate not found'
                });
            }

            res.status(200).json({
                success: true,
                data: candidates[0]
            });

        } catch (error) {
            console.error('Error in getCandidateById:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching candidate',
                error: error.message
            });
        }
    }
}

module.exports = new CandidateController(); 