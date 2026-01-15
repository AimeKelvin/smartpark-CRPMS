const express = require('express');
const router = express.Router();
const db = require('../config/database');
const {
  isAuthenticated
} = require('../middleware/auth');

// GENERATE BILL (For a specific car)
router.get('/bill/:plateNumber', isAuthenticated, async (req, res) => {
  const {
    plateNumber
  } = req.params;
  try {
    // Get Car Details
    const [cars] = await db.query('SELECT * FROM Car WHERE PlateNumber = ?', [plateNumber]);
    if (cars.length === 0) return res.status(404).json({
      message: 'Car not found'
    });
    const car = cars[0];

    // Get Unpaid Services (Logic: All services for this car)
    // Note: In a real system we'd link payments to specific records, but for this exam scope
    // we just list all services and total them up vs total payments
    const servicesQuery = `
      SELECT sr.ServiceDate, s.ServiceName, s.ServicePrice
      FROM ServiceRecord sr
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      WHERE sr.PlateNumber = ?
      ORDER BY sr.ServiceDate DESC
    `;
    const [services] = await db.query(servicesQuery, [plateNumber]);

    // Get Total Payments
    const [payments] = await db.query('SELECT SUM(AmountPaid) as totalPaid FROM Payment WHERE PlateNumber = ?', [plateNumber]);
    const totalServiceCost = services.reduce((sum, s) => sum + parseFloat(s.ServicePrice), 0);
    const totalPaid = payments[0].totalPaid || 0;
    const balance = totalServiceCost - totalPaid;
    res.json({
      car,
      services,
      summary: {
        totalServiceCost,
        totalPaid,
        balance
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// DAILY REPORT
router.get('/daily', isAuthenticated, async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0]; // Default to today

  try {
    // Services offered on date
    const servicesQuery = `
      SELECT sr.ServiceDate, c.PlateNumber, c.Model, s.ServiceName, s.ServicePrice
      FROM ServiceRecord sr
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      WHERE sr.ServiceDate = ?
    `;
    const [services] = await db.query(servicesQuery, [date]);

    // Payments received on date
    const paymentsQuery = `
      SELECT p.PaymentDate, p.AmountPaid, c.PlateNumber, c.Model
      FROM Payment p
      JOIN Car c ON p.PlateNumber = c.PlateNumber
      WHERE p.PaymentDate = ?
    `;
    const [payments] = await db.query(paymentsQuery, [date]);

    // Calculate totals
    const totalServiceValue = services.reduce((sum, s) => sum + parseFloat(s.ServicePrice), 0);
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.AmountPaid), 0);
    res.json({
      date,
      services,
      payments,
      totals: {
        totalServiceValue,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});
module.exports = router;