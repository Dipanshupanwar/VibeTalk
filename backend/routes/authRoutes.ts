import express from 'express';
import { sendOtp } from '../controllers/authController';
import { verifyOtp } from '../controllers/verifyOtp';
import { loginUser } from '../controllers/authController';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify', verifyOtp);
router.post('/login', loginUser);


export default router;
