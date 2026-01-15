const express = require('express');
const router = express.Router();
const db = require('../config/database');
const {
  isAuthenticated
} = require('../middleware/auth');

// GET ALL PAYMENTS
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const query = `
      SELECT p.PaymentNumber, p.AmountPaid, p.PaymentDate, p.PlateNumber,
             c.Model, c.DriverPhone
      FROM Payment p
      JOIN Car c ON p.PlateNumber = c.PlateNumber
      ORDER BY p.PaymentDate DESC
    `;
    const [payments] = await db.query(query);
    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// INSERT PAYMENT (INSERT ONLY)
router.post('/', isAuthenticated, async (req, res) => {
  const {
    amountPaid,
    paymentDate,
    plateNumber
  } = req.body;
  if (!amountPaid || !paymentDate || !plateNumber) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }
  try {
    await db.query('INSERT INTO Payment (AmountPaid, PaymentDate, PlateNumber) VALUES (?, ?, ?)', [amountPaid, paymentDate, plateNumber]);
    res.status(201).json({
      message: 'Payment recorded successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;