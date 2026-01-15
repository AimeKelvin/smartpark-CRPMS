const express = require('express');
const router = express.Router();
const db = require('../config/database');
const {
  isAuthenticated
} = require('../middleware/auth');

// FULL CRUD ALLOWED FOR SERVICE RECORDS

// GET ALL RECORDS (With JOINs)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const query = `
      SELECT sr.RecordNumber, sr.ServiceDate, sr.PlateNumber, sr.ServiceCode, 
             c.Model, c.DriverPhone, s.ServiceName, s.ServicePrice
      FROM ServiceRecord sr
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      ORDER BY sr.ServiceDate DESC
    `;
    const [records] = await db.query(query);
    res.json(records);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// INSERT RECORD
router.post('/', isAuthenticated, async (req, res) => {
  const {
    serviceDate,
    plateNumber,
    serviceCode
  } = req.body;
  if (!serviceDate || !plateNumber || !serviceCode) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }
  try {
    await db.query('INSERT INTO ServiceRecord (ServiceDate, PlateNumber, ServiceCode) VALUES (?, ?, ?)', [serviceDate, plateNumber, serviceCode]);
    res.status(201).json({
      message: 'Service record created successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// UPDATE RECORD
router.put('/:id', isAuthenticated, async (req, res) => {
  const {
    serviceDate,
    plateNumber,
    serviceCode
  } = req.body;
  const {
    id
  } = req.params;
  try {
    await db.query('UPDATE ServiceRecord SET ServiceDate = ?, PlateNumber = ?, ServiceCode = ? WHERE RecordNumber = ?', [serviceDate, plateNumber, serviceCode, id]);
    res.json({
      message: 'Service record updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// DELETE RECORD
router.delete('/:id', isAuthenticated, async (req, res) => {
  const {
    id
  } = req.params;
  try {
    await db.query('DELETE FROM ServiceRecord WHERE RecordNumber = ?', [id]);
    res.json({
      message: 'Service record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;