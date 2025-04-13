const createConversationTable = `
    CREATE TABLE IF NOT EXISTS conversations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        candidate_id INT,
        transcript TEXT NOT NULL,
        entities_extracted JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
    )
`;

module.exports = createConversationTable; 