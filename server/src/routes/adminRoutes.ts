import express from 'express';
import { adminController } from '../controllers/adminController'
const router = express.Router();

router.post('/promote/:id', adminController.promote);
router.post('/demote/:id', adminController.demote);
router.get('/admins', adminController.getAdmins);

export default router;