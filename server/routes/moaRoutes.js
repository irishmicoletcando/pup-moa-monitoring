const express = require('express');
const router = express.Router();
const moaController = require('../controllers/moaController');

// Fetch all MOAs
router.get('/moas', moaController.getAllMOAs);

// Add a new MOA
router.post('/moas', moaController.addMOA);

// Update an existing MOA
router.put('/moas/:id', moaController.updateMOA);

// Delete an MOA
router.delete('/moas/:id', moaController.deleteMOA);

module.exports = router;
