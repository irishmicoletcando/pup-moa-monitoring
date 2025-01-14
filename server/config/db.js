const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // to delete if cloud db
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1); // Exit the process if the DB connection fails
    } else {
        console.log('Connected to MySQL database.');
    }
});

module.exports = db;
