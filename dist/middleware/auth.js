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
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = require("../services/users");
const checkAuth = (moduleName) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("req.headers.authorization", req.headers.authorization);
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ type: Error, message: 'Please Login' });
            return;
        }
        try {
            const secret = process.env.secret || "secretkey";
            const decoded = yield jsonwebtoken_1.default.verify(token, secret);
            const user = yield (0, users_1.getUserById)(decoded._id);
            console.log("user", user);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            if (moduleName && !user.accessModules.includes(moduleName)) {
                res.status(401).json({ message: 'You do not have permission to access this module' });
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
};
exports.checkAuth = checkAuth;
