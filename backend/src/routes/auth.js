const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { register, login, getMe, getAllUsers } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, getAllUsers);

module.exports = router;