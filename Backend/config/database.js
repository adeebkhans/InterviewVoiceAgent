// config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a pooled connection with promise support
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection function
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database');
        connection.release();
        return true;
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
        return false;
    }
};

// Run initial connection test
testConnection();

module.exports = { pool };
