const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register User
const addUser = (req, res) => {
    const { firstname, lastname, email, role, contactNumber, password } = req.body;

    // Check if the email already exists
    const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(emailCheckQuery, [email], (err, result) => {
        if (err) return res.status(500).send('Error checking email');
        
        if (result.length > 0) {
            console.log(`User with email ${email} already exists.`);
            return res.status(400).send('User with this email already exists');
        }

        // Hash the password if email is unique
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).send('Error hashing password');

            const query = `
                INSERT INTO users (firstname, lastname, email, role, contact_number, password)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            db.query(
                query,
                [firstname, lastname, email, role, contactNumber, hashedPassword],
                (err, result) => {
                    console.log(err);
                    if (err) return res.status(400).send('Error inserting user');
                    res.status(201).send('User registered successfully');
                }
                
            );
        });
    });
};

// Get All Users
const getAllUsers = (req, res) => {
    // Ensure 'last_login' is included in the query
    const query = `
    SELECT user_id, firstname, lastname, email, role, contact_number, 
            CONVERT_TZ(last_login, '+00:00', '+08:00') AS last_login
    FROM users;
    `;

    
    db.query(query, (err, results) => {
        if (err) {
        console.error("Error fetching users:", err);  // Log the error for easier debugging
        return res.status(500).send('Error retrieving users');
        }
        
        // Log the fetched results to verify if 'last_login' is present
        console.log("Fetched users data:", results);  
        
        res.status(200).json({ users: results });
    });
};

// Update User
const updateUser = (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, role, contactNumber } = req.body;

    const query = `
        UPDATE users SET firstname = ?, lastname = ?, email = ?, role = ?, contact_number = ? WHERE user_id = ?
    `;

    db.query(
        query,
        [firstname, lastname, email, role, contactNumber, id],
        (err, result) => {
            if (err) return res.status(500).send('Error updating user');
            if (result.affectedRows === 0) return res.status(404).send('User not found');
            res.status(200).send('User updated successfully');
        }
    );
};

// Delete User
const deleteUser = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM users WHERE user_id = ?';

    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send('Error deleting user');
        if (result.affectedRows === 0) return res.status(404).send('User not found');
        res.status(200).send('User deleted successfully');
    });
};

// Login User
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], (err, results) => {
        if (err || results.length === 0) return res.status(400).send('User not found');

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).send('Error comparing passwords');
            if (!isMatch) return res.status(401).send('Invalid credentials');

            // Update the last login time to the current timestamp
            const updateQuery = `UPDATE users SET last_login = NOW() WHERE user_id = ?`;
            db.query(updateQuery, [user.user_id], (err, updateResult) => {
                if (err) {
                    console.error('Error updating last login time:', err);
                    return res.status(500).send('Error updating last login time');
                }

                // Check if the update was successful
                if (updateResult.affectedRows === 0) {
                    console.log('No rows were updated for user_id:', user.user_id);
                } else {
                    console.log('Last login time updated for user_id:', user.user_id);
                }

                // Generate JWT token if the passwords match
                const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

                // Return the token and last login time in the response
                res.status(200).json({
                    token,
                    lastLogin: user.last_login, // Send the updated last_login value
                    message: 'Login successful'
                });
            });
        });
    });
};

// Protected Route
const protectedRoute = (req, res) => {
    res.status(200).send('You have accessed a protected route!');
};

module.exports = {
    addUser,
    getAllUsers,
    updateUser,
    deleteUser,
    login,
    protected: protectedRoute,
};
