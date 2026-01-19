import express from 'express';
import auth from '../middleware/auth.js';
import * as carCtrl from '../controllers/car.controller.js';

const router = express.Router();
router.post('/', auth, carCtrl.createCar);
router.get('/', auth, carCtrl.getCars);
router.get('/:id', auth, carCtrl.getCar);
router.put('/:id', auth, carCtrl.updateCar);
router.delete('/:id', auth, carCtrl.deleteCar);

export default router;
