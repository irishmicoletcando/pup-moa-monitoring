const express = require('express');
const router = express.Router();
const multer = require('multer');
const moaController = require('../controllers/moaController');

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
    files: 10 // Maximum 10 files
  }
}).array('files');

// Fetch all MOAs
router.get('/moas', moaController.getAllMOAs);

// Add a new MOA
router.post('/moas', moaController.addMOA);

// Fetch specific MOA
router.get('/moas/:id', moaController.getMOAById);

// Update an existing MOA
router.patch('/moas/:id', upload, moaController.updateMOA);

// Delete an MOA
router.delete('/moas/:id', moaController.deleteMOA);

module.exports = router;