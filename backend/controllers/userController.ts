import { Request, Response } from 'express';
import { User } from '../models/UserModel';

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

