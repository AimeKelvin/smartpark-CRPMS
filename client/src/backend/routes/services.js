const express = require('express');
const router = express.Router();
const db = require('../config/database');
const {
  isAuthenticated
} = require('../middleware/auth');

// GET ALL SERVICES
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [services] = await db.query('SELECT * FROM Services');
    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// INSERT SERVICE (INSERT ONLY - NO UPDATE/DELETE per exam rules)
router.post('/', isAuthenticated, async (req, res) => {
  const {
    serviceCode,
    serviceName,
    servicePrice
  } = req.body;
  if (!serviceCode || !serviceName || !servicePrice) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }
  try {
    const [existing] = await db.query('SELECT ServiceCode FROM Services WHERE ServiceCode = ?', [serviceCode]);
    if (existing.length > 0) {
      return res.status(400).json({
        message: 'Service code already exists'
      });
    }
    await db.query('INSERT INTO Services (ServiceCode, ServiceName, ServicePrice) VALUES (?, ?, ?)', [serviceCode, serviceName, servicePrice]);
    res.status(201).json({
      message: 'Service added successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;