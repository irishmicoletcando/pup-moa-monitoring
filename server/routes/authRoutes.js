const express = require('express');
const {login, protected, addUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add-user', addUser);
router.post('/login', login);
router.get('/protected', authMiddleware, protected);

module.exports = router;
