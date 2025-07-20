import { Request, Response } from 'express';
import { User } from '../models/UserModel';
import { sendOTP } from '../utils/sendEmail';
import { tempUserData } from '../utils/tempUserStore';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';





export const sendOtp = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Email, name, and password are required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save in-memory temp user data
  tempUserData[email] = { name, password };
  console.log('✅ Saving to tempUserData:', tempUserData);


  // Save or update OTP in DB
  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email });
  }

  user.otp = otp;
  await user.save();

  await sendOTP(email, otp); // Send OTP via nodemailer
  res.json({ message: 'OTP sent successfully ✅' });
};




export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  console.log( "this is email", email)
  console.log("Fetched user object:", user);
console.log("Fetched password:", user?.password);

    console.log( " this is user",user)
  if (!user || !user.verified) {
    return res.status(400).json({ error: 'User not found or not verified ❌' });
  }

  if (!user.password) {
  return res.status(500).json({ error: "User password not set in DB ❌" });
}

const isMatch = await bcrypt.compare(password, user.password!); // 👈 Notice the `!`


  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect password ❌' });
  }

const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });


  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};
