const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Register User
exports.signup = (req, res) => {
    const { email, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing password');

        const query = `INSERT INTO users (email, password) VALUES (?, ?, ?)`;

        db.query(query, [email, hashedPassword], (err, result) => {
            if (err) return res.status(400).send('User already exists');
            res.status(201).send('User registered successfully');
        });
    });
};

// Login User
exports.login = (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users WHERE email = ?`;

    db.query(query, [email], (err, results) => {
        if (err || results.length === 0) return res.status(400).send('User not found');

        const user = results[0];

        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err || !isMatch) return res.status(401).send('Invalid credentials');

            // Generate token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ token });
        });
    });
};

// Protected Route
exports.protected = (req, res) => {
    res.status(200).send('You have accessed a protected route!');
};
