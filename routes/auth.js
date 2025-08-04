const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const pool = require('../db');
const { authenticateToken, authorizeManager } = require('../middleware/authMiddleware'); // ✅ Added

// dynamically linked database for authentication
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// only managers can register new users
router.post('/register', authenticateToken, authorizeManager, async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required' });
  }

  try {
    const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, password, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

module.exports = router;
