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
exports.resetPasswordService = exports.sendPasswordResetEmail = exports.updateProfile = exports.userLogin = exports.getUserByEmail = exports.getUserById = exports.createUser = void 0;
const users_1 = __importDefault(require("../models/users"));
const uuid_1 = require("uuid");
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new users_1.default(userData);
        yield user.save();
        return user;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.createUser = createUser;
const getUserById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield users_1.default.findById(userId);
        return user;
    }
    catch (error) {
        throw new Error(error.message);
    }
});
exports.getUserById = getUserById;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return users_1.default.findOne({ email });
});
exports.getUserByEmail = getUserByEmail;
const userLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = yield user.isPasswordMatch(password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    return user;
});
exports.userLogin = userLogin;
const updateProfile = (userId, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findByIdAndUpdate(userId, updatedData);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
exports.updateProfile = updateProfile;
// Generate a 6-digit token from UUID
const generateResetToken = () => {
    const uuid = (0, uuid_1.v4)();
    const token = uuid.split('-').join('').substring(0, 6);
    return token;
};
// will be set in env
// process.env.EMAIL_USER
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'elmer.heaney@ethereal.email',
        pass: 'eb7akmTn8NWDvGtPxG'
    }
});
const sendPasswordResetEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ email });
    if (!user) {
        throw new Error('User with this email does not exist');
    }
    const resetToken = generateResetToken();
    const resetTokenExpiration = new Date(Date.now() + 3600000); // Token valid for 1 hour
    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    yield user.save();
    const mailOptions = {
        from: 'priyankapatel2281@gmail.com',
        to: user.email,
        subject: 'Password Reset',
        text: `You requested a password reset. Use the following token to reset your password: ${resetToken}`,
    };
    yield transporter.sendMail(mailOptions);
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const resetPasswordService = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.findOne({ resetToken: token, resetTokenExpiration: { $gt: new Date() } })
        .select('+resetToken +resetTokenExpiration'); // Ensure these fields are selected
    if (!user) {
        throw new Error('Invalid or expired reset token');
    }
    // Update user's password
    user.password = yield bcrypt_1.default.hash(newPassword, 8);
    user.resetToken = "null";
    user.resetTokenExpiration;
    // Save the updated user
    yield user.save();
});
exports.resetPasswordService = resetPasswordService;
