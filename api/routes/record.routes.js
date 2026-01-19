import express from 'express';
import auth from '../middleware/auth.js';
import * as recordCtrl from '../controllers/record.controller.js';

const router = express.Router();
router.post('/', auth, recordCtrl.createRecord);
router.get('/', auth, recordCtrl.getRecords);
router.get('/:id', auth, recordCtrl.getRecord);
router.put('/:id', auth, recordCtrl.updateRecord);
router.delete('/:id', auth, recordCtrl.deleteRecord);

export default router;
