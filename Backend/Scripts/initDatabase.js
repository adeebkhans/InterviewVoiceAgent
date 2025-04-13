require('dotenv').config();
const mysql = require('mysql2/promise');
const createJobTable = require('../Schema/JobSchema');
const createCandidateTable = require('../Schema/CandidateSchema');
const createAppointmentTable = require('../Schema/AppointmentSchema');
const createConversationTable = require('../Schema/ConversationSchema');

const initDatabase = async () => {
    let connection;
    try {
        // Create connection without database selected
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log('Database created or already exists');

        // Use the database
        await connection.query(`USE ${process.env.DB_NAME}`);

        // Create tables in order (respecting foreign key relationships)
        console.log('Creating jobs table...');
        await connection.query(createJobTable);

        console.log('Creating candidates table...');
        await connection.query(createCandidateTable);

        console.log('Creating appointments table...');
        await connection.query(createAppointmentTable);

        console.log('Creating conversations table...');
        await connection.query(createConversationTable);

        console.log('All tables created successfully!');

    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

// Run the initialization
(async () => {
    try {
        await initDatabase();
        process.exit(0);
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
})(); 