import { Request, Response } from 'express';
import User from '../models/userModel';
import { sendOTPEmail } from '../utils/otp';
import { generateToken } from '../utils/jwt';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, username } = req.body;

  // Validate both fields
  if (!email || !username) {
    res.status(400).json({ message: 'Email and Username are required' });
    return;
  }

  try {
    // Check for existing user with same email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP email
    await sendOTPEmail(email, otp);

    // Create and save new user with all required fields — fine here
    const newUser = new User({ email, username, otp });
    await newUser.save();

    res.status(200).json({ message: 'OTP sent to email' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Signup failed', error });
  }
};


export const sendLoginOTP = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      res.status(404).json({ message: 'No account found with this email' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendOTPEmail(email, otp);

    // safely update just the otp without validation issues
    await User.updateOne({ email }, { otp });

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send login OTP', error: err });
  }
};



export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP' });
      return;
    }

    // Clean atomic partial update — remove otp safely
    await User.updateOne({ email }, { $unset: { otp: "" } });

    const token = generateToken(user._id.toString(), user.username, user.email);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'OTP verification failed', error });
  }
};
