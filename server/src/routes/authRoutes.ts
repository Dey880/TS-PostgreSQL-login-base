import express from 'express';
import { authController } from '../controllers/authController';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/user', authController.getuser);
router.get('/logout', authController.logout);


export default router;