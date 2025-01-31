const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });
const cron = require('node-cron'); // Ensure cron is required

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
        // console.log('Connected to MySQL database.');
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

// Schedule a job to run every day at midnight
cron.schedule('* * * * *', async () => {
    // console.log('Running cron job to update MOA statuses...');

    const query = `
        SELECT v.validity_id, v.moa_id, v.expiry_date, m.status AS current_status
        FROM moa_validity_period v
        JOIN moa_info m ON v.moa_id = m.moa_id
        ORDER BY v.expiry_date ASC
    `;

    try {
        const [results] = await pool.query(query);
        const today = new Date();
        const threeMonthsLater = new Date(today);
        threeMonthsLater.setMonth(today.getMonth() + 3);

        for (const row of results) {
            const expiryDate = new Date(row.expiry_date);
            let newStatus = row.current_status;

            if (expiryDate < today) {
                newStatus = 'Expired';
            } else if (expiryDate <= threeMonthsLater) {
                newStatus = 'Expiry';
            } else {
                newStatus = 'Active';
            }

            if (newStatus !== row.current_status) {
                const updateQuery = `UPDATE moa_info SET status = ? WHERE moa_id = ?`;
                await pool.query(updateQuery, [newStatus, row.moa_id]);
                // console.log(`✅ Updated status for MOA ID ${row.moa_id} to ${newStatus}`);
            }
        }
    } catch (err) {
        // console.error('❌ Error running cron job:', err);
    }
}); 

// Export both
module.exports = { db, dbPromise, pool };
