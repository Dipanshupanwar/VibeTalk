import { tempUserData } from '../utils/tempUserStore';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/UserModel';


export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  console.log("Frontend OTP:", otp);
console.log("Stored OTP:", user?.otp);
console.log("email :", email)
console.log("user is here", user)

if (!user || String(user.otp) !== String(otp)) {
  return res.status(400).json({ error: 'Invalid OTP ❌' });
}

console.log( "this is temp", tempUserData[email])
console.log('📦 Reading from tempUserData:', tempUserData[email]);



  const tempData = tempUserData[email];
  if (!tempData) {
    return res.status(400).json({ error: 'No user data found for OTP flow ❌' });
  }
  console.log( "temp is here ",tempData)

  const hashedPassword = await bcrypt.hash(tempData.password, 10);

  // Save full user only after OTP is verified
  user.name = tempData.name;
  user.password = hashedPassword;
  user.verified = true;
  user.otp = '';
  await user.save();

  // Delete temp data after use
  delete tempUserData[email];

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};
