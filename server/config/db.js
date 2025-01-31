const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

// Single connection for backward compatibility
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Remove if using cloud DB
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connection test
db.connect((err) => {
    if (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1); // Exit the process if the DB connection fails
    } else {
        console.log('Connected to MySQL database.');
    }
});

// Promise wrapper for async/await support
const dbPromise = db.promise();

// Connection pool for `getConnection()`
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0
}).promise(); // Enable promise support

// Export both
module.exports = { db, dbPromise, pool };
