import express from 'express';
import auth from '../middleware/auth.js';
import * as serviceCtrl from '../controllers/service.controller.js';

const router = express.Router();
router.post('/', auth, serviceCtrl.createService);
router.get('/', auth, serviceCtrl.getServices);
router.get('/:id', auth, serviceCtrl.getService);
router.put('/:id', auth, serviceCtrl.updateService);
router.delete('/:id', auth, serviceCtrl.deleteService);

export default router;
