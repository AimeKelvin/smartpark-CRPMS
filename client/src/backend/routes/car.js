const express = require('express');
const router = express.Router();
const db = require('../config/database');
const {
  isAuthenticated
} = require('../middleware/auth');

// GET ALL CARS
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [cars] = await db.query('SELECT * FROM Car ORDER BY ManufacturingYear DESC');
    res.json(cars);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET SINGLE CAR
router.get('/:plateNumber', isAuthenticated, async (req, res) => {
  try {
    const [cars] = await db.query('SELECT * FROM Car WHERE PlateNumber = ?', [req.params.plateNumber]);
    if (cars.length === 0) return res.status(404).json({
      message: 'Car not found'
    });
    res.json(cars[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// INSERT CAR (INSERT ONLY - NO UPDATE/DELETE per exam rules)
router.post('/', isAuthenticated, async (req, res) => {
  const {
    plateNumber,
    type,
    model,
    manufacturingYear,
    driverPhone,
    mechanicName
  } = req.body;

  // Validation
  if (!plateNumber || !type || !model || !manufacturingYear || !driverPhone || !mechanicName) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }
  try {
    // Check duplicate
    const [existing] = await db.query('SELECT PlateNumber FROM Car WHERE PlateNumber = ?', [plateNumber]);
    if (existing.length > 0) {
      return res.status(400).json({
        message: 'Car with this plate number already exists'
      });
    }
    await db.query('INSERT INTO Car (PlateNumber, Type, Model, ManufacturingYear, DriverPhone, MechanicName) VALUES (?, ?, ?, ?, ?, ?)', [plateNumber, type, model, manufacturingYear, driverPhone, mechanicName]);
    res.status(201).json({
      message: 'Car registered successfully',
      plateNumber
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;