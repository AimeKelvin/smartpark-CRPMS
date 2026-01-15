const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  // Frontend URL
  credentials: true // Allow cookies
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'smartpark_secret_key_2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Import Routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car');
const serviceRoutes = require('./routes/services');
const recordRoutes = require('./routes/serviceRecord');
const paymentRoutes = require('./routes/payment');
const reportRoutes = require('./routes/reports');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-records', recordRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// Demo Data Seed Route
const db = require('./config/database');
const {
  seedDemoData
} = require('./seed-demo-data');
app.post('/api/seed-demo', async (req, res) => {
  try {
    const result = await seedDemoData(db);
    res.json(result);
  } catch (error) {
    console.error('Error seeding demo data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed demo data',
      error: error.message
    });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('SmartPark CRPMS Backend is running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});