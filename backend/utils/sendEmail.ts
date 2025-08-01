import nodemailer from 'nodemailer';

export const sendOTP = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"Chat App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP for Chat App',
    html: `<h1>Your OTP is: ${otp}</h1>`
  });
};
