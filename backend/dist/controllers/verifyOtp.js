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
exports.verifyOtp = void 0;
const tempUserStore_1 = require("../utils/tempUserStore");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = require("../models/UserModel");
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    const user = yield UserModel_1.User.findOne({ email });
    console.log("Frontend OTP:", otp);
    console.log("Stored OTP:", user === null || user === void 0 ? void 0 : user.otp);
    console.log("email :", email);
    console.log("user is here", user);
    if (!user || String(user.otp) !== String(otp)) {
        return res.status(400).json({ error: 'Invalid OTP ❌' });
    }
    console.log("this is temp", tempUserStore_1.tempUserData[email]);
    console.log('📦 Reading from tempUserData:', tempUserStore_1.tempUserData[email]);
    const tempData = tempUserStore_1.tempUserData[email];
    if (!tempData) {
        return res.status(400).json({ error: 'No user data found for OTP flow ❌' });
    }
    console.log("temp is here ", tempData);
    const hashedPassword = yield bcrypt_1.default.hash(tempData.password, 10);
    // Save full user only after OTP is verified
    user.name = tempData.name;
    user.password = hashedPassword;
    user.verified = true;
    user.otp = '';
    yield user.save();
    // Delete temp data after use
    delete tempUserStore_1.tempUserData[email];
    const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
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
});
exports.verifyOtp = verifyOtp;
