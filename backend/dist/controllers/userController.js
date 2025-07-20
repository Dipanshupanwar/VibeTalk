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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.getUserById = exports.getUsers = void 0;
const UserModel_1 = require("../models/UserModel");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUserId = req.userId;
    const users = yield UserModel_1.User.find({ _id: { $ne: currentUserId }, verified: true });
    res.json({ users });
});
exports.getUsers = getUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel_1.User.findById(req.params.id);
    if (!user)
        return res.status(404).json({ error: "User not found" });
    res.json({ user });
});
exports.getUserById = getUserById;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel_1.User.findById(req.userId);
    if (!user)
        return res.status(404).json({ error: "User not found" });
    res.json({ user });
});
exports.getCurrentUser = getCurrentUser;
