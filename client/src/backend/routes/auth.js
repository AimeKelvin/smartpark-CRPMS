const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/database');

// REGISTER (For initial setup)
router.post('/register', async (req, res) => {
  const {
    username,
    password,
    email
  } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }
  try {
    // Check if user exists
    const [existing] = await db.query('SELECT * FROM User WHERE Username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({
        message: 'Username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query('INSERT INTO User (Username, Password, Email, Role) VALUES (?, ?, ?, ?)', [username, hashedPassword, email, 'admin']);
    res.status(201).json({
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM User WHERE Username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Create session
    req.session.user = {
      id: user.UserID,
      username: user.Username,
      role: user.Role
    };
    res.json({
      message: 'Login successful',
      user: req.session.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error'
    });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({
        message: 'Could not log out'
      });
    }
    res.json({
      message: 'Logout successful'
    });
  });
});

// CHECK AUTH STATUS
router.get('/check', (req, res) => {
  if (req.session.user) {
    res.json({
      isAuthenticated: true,
      user: req.session.user
    });
  } else {
    res.json({
      isAuthenticated: false
    });
  }
});

// FORGOT PASSWORD (Stub)
router.post('/forgot-password', async (req, res) => {
  const {
    email
  } = req.body;
  // In a real app, we would send an email here
  // For exam purposes, we just acknowledge the request
  console.log(`Password recovery requested for: ${email}`);
  res.json({
    message: 'If the email exists, recovery instructions have been sent.'
  });
});
module.exports = router;