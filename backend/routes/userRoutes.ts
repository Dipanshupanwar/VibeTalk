import express from "express";
import {
  getUsers,
  getCurrentUser,
  getUserById,
  updateProfilePicture,
} from "../controllers/userController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", verifyToken, getUsers);
router.get("/me", verifyToken, getCurrentUser);
router.put("/profile-picture", verifyToken, updateProfilePicture); // ✅
router.get("/:id", verifyToken, getUserById);


export default router;
