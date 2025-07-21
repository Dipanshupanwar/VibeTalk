import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: String,
  otp: String,
  verified: { type: Boolean, default: false },
  profilePic: {
    type: String,
    default: "", // or you can set a placeholder/default image URL
  },
});

export const User = mongoose.model('chatUser', userSchema);
