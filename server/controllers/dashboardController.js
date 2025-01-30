const db = require('../config/db');

const getMOAStats = (req, res) => {
    const query = `
        SELECT 
            type_id, 
            COUNT(*) AS count 
        FROM moa_info 
        GROUP BY type_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching MOA statistics:", err);
            return res.status(500).send('Error retrieving MOA statistics');
        }

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
    });
};

module.exports = { getMOAStats };
