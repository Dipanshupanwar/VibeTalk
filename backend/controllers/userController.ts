import { Request, Response } from 'express';
import { User } from '../models/UserModel';

// ✅ Update profile picture
export const updateProfilePicture = async (req: Request, res: Response) => {
  console.log("🔥 HIT /api/users/profile-picture");

  const userId = (req as any).userId;
  const { profilePic } = req.body;

  if (!profilePic) {
    return res.status(400).json({ message: "No profile picture provided" });
  }

  await User.findByIdAndUpdate(userId, { profilePic });

  res.status(200).json({ message: "Profile picture updated successfully" });
};



export const getUsers = async (req: Request, res: Response) => {
  const currentUserId = (req as any).userId;
  const users = await User.find({ _id: { $ne: currentUserId }, verified: true });
  res.json({ users });
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = await User.findById((req as any).userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
};

