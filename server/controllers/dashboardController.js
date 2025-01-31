const { pool } = require('../config/db');

const getMOACountByType = async (req, res) => {
    const query = `
        SELECT 
            type_id, 
            COUNT(*) AS count 
        FROM moa_info 
        GROUP BY type_id
    `;

    try {
        const [results] = await pool.query(query);

        // Map type_id values to their corresponding MOA type names
        const moaTypes = {
            1: "practicum",
            2: "employment",
            3: "scholarship",
            4: "research"
        };

        // Convert results into a dictionary
        const stats = {};
        results.forEach(row => {
            stats[moaTypes[row.type_id]] = row.count;
        });

        // Ensure all types exist in the response (default to 0 if missing)
        Object.keys(moaTypes).forEach(typeId => {
            const typeName = moaTypes[typeId];
            if (!stats[typeName]) {
                stats[typeName] = 0;
            }
        });

        res.status(200).json(stats);
    } catch (err) {
        console.error("Error fetching MOA statistics:", err);
        res.status(500).send('Error retrieving MOA statistics');
    }
};

const getMOACountByStatus = async (req, res) => {
    const query = `
        SELECT 
            status, 
            COUNT(*) AS count 
        FROM moa_info 
        GROUP BY status
    `;

    try {
        const [results] = await pool.query(query);

        // Convert results into a dictionary
        const stats = {};
        results.forEach(row => {
            stats[row.status] = row.count;
        });

        // Ensure all possible statuses exist in the response (default to 0 if missing)
        const possibleStatuses = ["Active", "Expiry", "Expired"];
        possibleStatuses.forEach(status => {
            if (!stats[status]) {
                stats[status] = 0;
            }
        });

        res.status(200).json(stats);
    } catch (err) {
        console.error("Error fetching MOA statistics by status:", err);
        res.status(500).send('Error retrieving MOA statistics by status');
    }
};

module.exports = { getMOACountByType, getMOACountByStatus };
