const createCandidateTable = `
    CREATE TABLE IF NOT EXISTS candidates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        current_ctc DECIMAL(10,2),
        expected_ctc DECIMAL(10,2),
        notice_period INT,
        experience DECIMAL(4,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

module.exports = createCandidateTable; 