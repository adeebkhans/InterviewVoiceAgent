require('dotenv').config();
const { pool } = require('../config/database');

const createTables = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Create tables in order (respecting foreign key relationships)
        
        // 1. Admins table
        console.log('Creating admins table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('super_admin', 'admin', 'moderator') NOT NULL DEFAULT 'admin',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX email_index (email)
            )
        `);

        // 2. Jobs table
        console.log('Creating jobs table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                role VARCHAR(255) NOT NULL,
                requirements JSON NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            )
        `);

        // 3. Interview slots table
        console.log('Creating interview_slots table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS interview_slots (
                id INT PRIMARY KEY AUTO_INCREMENT,
                job_id INT,
                start_time DATETIME NOT NULL,
                end_time DATETIME NOT NULL,
                is_booked BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
            )
        `);

        // 4. Candidates table
        console.log('Creating candidates table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS candidates (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20),
                resume_url TEXT,
                status ENUM('pending', 'interviewed', 'selected', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE,
                INDEX email_index (email)
            )
        `);

        // 5. Conversation logs table
        console.log('Creating conversation_logs table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS conversation_logs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                candidate_id INT,
                message TEXT NOT NULL,
                message_type ENUM('candidate', 'system') NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
            )
        `);

        // 6. Appointments table
        console.log('Creating appointments table...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS appointments (
                id INT PRIMARY KEY AUTO_INCREMENT,
                candidate_id INT,
                job_id INT,
                interview_slot_id INT,
                status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
                FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
                FOREIGN KEY (interview_slot_id) REFERENCES interview_slots(id) ON DELETE CASCADE
            )
        `);

        console.log('All tables created successfully!');

    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};

// Run the initialization
(async () => {
    try {
        await createTables();
        console.log('Database initialization completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
})(); 