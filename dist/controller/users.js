"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.resetPassword = exports.forgotPassword = exports.updateUserProfile = exports.login = exports.getUserById = exports.createUser = void 0;
const userService = __importStar(require("../services/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.createUser(req.body);
        res.status(201).json(user);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
exports.createUser = createUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userService.getUserById(req.params.userId);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
});
exports.getUserById = getUserById;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userService.userLogin(email, password);
        const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email }, "secret9797979");
        res.status(200).send({
            type: 'success',
            data: { user, token },
            message: 'Logged in successfully.',
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.login = login;
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(req.user);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const updatedData = req.body;
        const updatedUser = yield userService.updateProfile(userId, updatedData);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.updateUserProfile = updateUserProfile;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield userService.sendPasswordResetEmail(email);
        res.status(200).json({ message: 'Password reset email sent' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, newPassword } = req.body;
        yield userService.resetPasswordService(token, newPassword);
        res.status(200).json({ message: 'Password has been reset' });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.resetPassword = resetPassword;
