const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, dbPromise, pool } = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '../../.env' });


// Register User
const addUser = async (req, res) => {
    const { firstname, lastname, email, role, contactNumber, access_other_moa, password } = req.body;

    try {
        // Check if the email already exists
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.status(400).send('User with this email already exists');
        }

        // Bypass the TLS, remove after development
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for port 465, false for other ports
            auth: {
            user: process.env.CRED_USERNM_SENDER, // Gmail Username
            pass: process.env.CRED_USERPW_SENDER, // Gmail password 
            },
        });

        //Create template for sending credentials to admins
        const credEmailTemplate = {
            from: {
                name: 'PUP MOA Monitoring',
                address: process.env.CRED_USERNM_SENDER
            }, // sender address
            to: [email], // list of receivers
            subject: "PUP MOA Monitoring Admin Credentials", // Subject line
            text: `Hello,

                    Your credentials for accessing the PUP MOA Monitoring admin account are as follows:

                    Email: ${email}
                    Password: ${password}

                    Please keep your credentials safe.

                    Best regards,
                    PUP MOA Monitoring Team`, // plain text body
            html: `<p>Hello,</p>
                            <p>Your credentials for accessing the PUP MOA Monitoring admin account are as follows:</p>
                            <p><strong>Email:</strong> ${email}</p>
                            <p><strong>Password:</strong> ${password}</p>
                            <p>Please keep your credentials safe.</p>
                            <p>Best regards,<br>
                            PUP MOA Monitoring Team</p>`, // html body
            };

            const sendMail = async (transporter, credEmailTemplate) => {
                try{
                    await transporter.sendMail(credEmailTemplate)
                }     
                catch (error){
                    // console.error(error)
                }
            }
            
        sendMail(transporter, credEmailTemplate);

        // Hash the password if email is unique
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (firstname, lastname, email, role, contact_number, access_other_moa, password)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.query(query, [firstname, lastname, email, role, contactNumber, access_other_moa, hashedPassword]);
        res.status(201).send('User registered successfully');
    } catch (err) {
        // console.error(err);
        res.status(500).send('Error processing user registration');
    }
};

// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const query = `
        SELECT user_id, firstname, lastname, email, role, contact_number, access_other_moa,
                CONVERT_TZ(last_login, '+00:00', '+08:00') AS last_login
        FROM users;
        `;

        const [results] = await pool.query(query);
        res.status(200).json({ users: results });
    } catch (err) {
        res.status(500).send('Error retrieving users');
    }
};

// Update User
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, role, contactNumber, access_other_moa } = req.body;

    try {
        const query = `
            UPDATE users SET firstname = ?, lastname = ?, email = ?, role = ?, contact_number = ?, access_other_moa = ? WHERE user_id = ?
        `;

        const [result] = await pool.query(query, [firstname, lastname, email, role, contactNumber, access_other_moa, id]);

        if (result.affectedRows === 0) return res.status(404).send('User not found');
        res.status(200).send('User updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating user');
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    const userId = parseInt(id, 10);
    if (!userId || isNaN(userId)) {
        return res.status(400).json({ 
            message: 'Invalid user ID'
        });
    }

    try {
        const query = 'DELETE FROM users WHERE user_id = ?';

        const [result] = await pool.query(query, [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                message: 'User not found'
            });
        }

        res.status(200).send({ 
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error while deleting user'
        });
    }
};

// Login User
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const [results] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (results.length === 0) return res.status(400).send('User not found');

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send('Invalid credentials');

        // Update the last login time to the current timestamp
        const updateQuery = 'UPDATE users SET last_login = NOW() WHERE user_id = ?';
        const [updateResult] = await pool.query(updateQuery, [user.user_id]);

        if (updateResult.affectedRows === 0) {
            // console.log('No rows were updated for user_id:', user.user_id);
        } else {
            // console.log('Last login time updated for user_id:', user.user_id);
        }

        // Generate JWT token if the passwords match
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        // const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1m' }); // [DEBUGGING]

        // Return the token and last login time in the response
        res.status(200).json({
            user_id: user.user_id,
            firstname: user.firstname,
            lastname: user.lastname,
            role: user.role,
            token,
            lastLogin: user.last_login, // Send the updated last_login value
            message: 'Login successful'
        });
    } catch (err) {
        res.status(500).send('Error during login');
    }
};

const renewToken = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
        if (err) return res.status(403).send('Invalid Token');

        // Issue a new token with another 2 hour expiry
        const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        // const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1m' }); // [DEBUGGING]

        res.status(200).json({ token: newToken });
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
    renewToken,
    protected: protectedRoute,
};
