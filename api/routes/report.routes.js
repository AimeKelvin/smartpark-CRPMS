import express from 'express';
import auth from '../middleware/auth.js';
import { generateMonthlyReport } from '../controllers/report.controller.js';

const router = express.Router();

// GET /api/reports/monthly?month=1&year=2026
router.get('/monthly', auth, generateMonthlyReport);

export default router;
