const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });
const cron = require('node-cron');

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

// Schedule a job to run every day at midnight
cron.schedule('* * * * *', () => {
    console.log('Running cron job to update MOA statuses...');
    
    const query = `
        SELECT v.validity_id, v.moa_id, v.expiry_date, m.status AS current_status
        FROM moa_validity_period v
        JOIN moa_info m ON v.moa_id = m.moa_id
        ORDER BY v.expiry_date ASC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching MOA validity periods:', err);
            return;
        }

        const today = new Date();
        const threeMonthsLater = new Date(today);
        threeMonthsLater.setMonth(today.getMonth() + 3); // 3 months from today

        results.forEach(row => {
            const expiryDate = new Date(row.expiry_date);
            const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

            let newStatus = row.current_status;

            // Determine the new status based on the expiry date
            if (expiryDate < today) {
                newStatus = 'Expired'; // MOA has expired
            } else if (expiryDate <= threeMonthsLater) {
                newStatus = 'Expiry'; // MOA will expire within 3 months
            } else {
                newStatus = 'Active'; // MOA is still active
            }

            // If status needs to be updated, run the update query
            if (newStatus !== row.current_status) {
                const updateQuery = `
                    UPDATE moa_info 
                    SET status = ? 
                    WHERE moa_id = ?
                `;
                db.query(updateQuery, [newStatus, row.moa_id], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error(`❌ Error updating status for MOA ID ${row.moa_id}:`, updateErr);
                    } else {
                        console.log(`✅ Updated status for MOA ID ${row.moa_id} to ${newStatus}`);
                    }
                });
            }
        });
    });
});

module.exports = db;
