import express from 'express';
import auth from '../middleware/auth.js';
import * as paymentCtrl from '../controllers/payment.controller.js';

const router = express.Router();
router.post('/', auth, paymentCtrl.createPayment);
router.get('/', auth, paymentCtrl.getPayments);
router.get('/:id', auth, paymentCtrl.getPayment);
router.put('/:id', auth, paymentCtrl.updatePayment);
router.delete('/:id', auth, paymentCtrl.deletePayment);

export default router;
