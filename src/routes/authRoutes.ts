import express from 'express';
import { signup, verifyOTP, sendLoginOTP } from '../controllers/authControllers';
import passport from 'passport';
import { generateToken } from '../utils/jwt';

const router = express.Router();

router.post('/signup', signup);
router.post('/send-login-otp', sendLoginOTP);
router.post('/verify-otp', verifyOTP);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user as any;
    const token = generateToken(user._id.toString(), user.username, user.email);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}`);
  }
);
export default router;
