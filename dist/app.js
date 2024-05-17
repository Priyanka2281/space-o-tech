"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = __importDefault(require("./routes/users"));
const product_1 = __importDefault(require("./routes/product"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/users', users_1.default);
app.use('/api/products', product_1.default);
// MongoDB Connection
mongoose_1.default.connect("mongodb://localhost:27017/space-o")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB', err));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
