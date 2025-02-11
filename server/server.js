const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const moaRoutes = require('./routes/moaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Specifying the path to the parent folder's .env file
dotenv.config({ path: '../.env' });

// Create the Express app
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use authentication routes
app.use('/api/auth', authRoutes);
// Register MOA routes
app.use('/api', moaRoutes);
// Register dashboard routes
app.use('/api', dashboardRoutes);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
