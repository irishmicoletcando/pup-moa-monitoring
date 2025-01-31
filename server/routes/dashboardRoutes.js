const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/moa-count-type', dashboardController.getMOACountByType);
router.get('/moa-count-status', dashboardController.getMOACountByStatus);
module.exports = router;
