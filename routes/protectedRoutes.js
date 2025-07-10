const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}! You are logged in.` });
});

module.exports = router;
