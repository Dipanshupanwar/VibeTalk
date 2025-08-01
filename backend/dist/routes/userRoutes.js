"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get("/", authMiddleware_1.verifyToken, userController_1.getUsers);
router.get("/me", authMiddleware_1.verifyToken, userController_1.getCurrentUser);
router.get("/:id", authMiddleware_1.verifyToken, userController_1.getUserById);
exports.default = router;
