const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register User
const addUser = (req, res) => {
    const { firstname, lastname, email, role, contactNumber, password } = req.body;
    console.log(req.body);

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



// Login User
const login = (req, res) => {
    const { email, password } = req.body;

    // Check if email or password is missing
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    const query = `SELECT * FROM users WHERE email = ?`;

    db.query(query, [email], (err, results) => {
        if (err || results.length === 0) return res.status(400).send('User not found');

        const user = results[0];

        // Compare the plain text password with the hashed password in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
            console.log(password, user.password, isMatch);
            if (err) return res.status(500).send('Error comparing passwords');
            if (!isMatch) return res.status(401).send('Invalid credentials');

            // Generate JWT token if the passwords match
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ 
                token,
                message: 'Login successful'
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
    login,
    protected: protectedRoute,
};
