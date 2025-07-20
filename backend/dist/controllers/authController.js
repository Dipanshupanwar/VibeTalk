"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.sendOtp = void 0;
const UserModel_1 = require("../models/UserModel");
const sendEmail_1 = require("../utils/sendEmail");
const tempUserStore_1 = require("../utils/tempUserStore");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json({ error: 'Email, name, and password are required' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Save in-memory temp user data
    tempUserStore_1.tempUserData[email] = { name, password };
    console.log('✅ Saving to tempUserData:', tempUserStore_1.tempUserData);
    // Save or update OTP in DB
    let user = yield UserModel_1.User.findOne({ email });
    if (!user) {
        user = new UserModel_1.User({ email });
    }
    user.otp = otp;
    yield user.save();
    yield (0, sendEmail_1.sendOTP)(email, otp); // Send OTP via nodemailer
    res.json({ message: 'OTP sent successfully ✅' });
});
exports.sendOtp = sendOtp;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield UserModel_1.User.findOne({ email });
    console.log("this is email", email);
    console.log("Fetched user object:", user);
    console.log("Fetched password:", user === null || user === void 0 ? void 0 : user.password);
    console.log(" this is user", user);
    if (!user || !user.verified) {
        return res.status(400).json({ error: 'User not found or not verified ❌' });
    }
    if (!user.password) {
        return res.status(500).json({ error: "User password not set in DB ❌" });
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password); // 👈 Notice the `!`
    if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect password ❌' });
    }
    const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });
    res.json({
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
});
exports.loginUser = loginUser;
