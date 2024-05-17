"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controller/users");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', users_1.createUser);
router.get('/:userId', users_1.getUserById);
router.post('/login', users_1.login);
router.put('/profile', (0, auth_1.checkAuth)("update_profile"), users_1.updateUserProfile);
router.post('/forgot-password', users_1.forgotPassword);
router.post('/reset-password', users_1.resetPassword);
exports.default = router;
