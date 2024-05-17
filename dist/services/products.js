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
exports.buyProducts = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const products_1 = __importDefault(require("../models/products"));
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const product = new products_1.default(productData);
    return product.save();
});
exports.createProduct = createProduct;
const getAllProducts = (page, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield products_1.default.find({ isDeleted: false })
        .skip((page - 1) * limit)
        .limit(limit);
    const total = yield products_1.default.countDocuments({ isDeleted: false });
    return { products, total };
});
exports.getAllProducts = getAllProducts;
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return products_1.default.findById({ id, isDeleted: false });
});
exports.getProductById = getProductById;
const updateProduct = (id, productData) => __awaiter(void 0, void 0, void 0, function* () {
    return products_1.default.findByIdAndUpdate(id, productData);
});
exports.updateProduct = updateProduct;
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return products_1.default.updateOne({ _id: id }, { $set: { isDeleted: true } });
});
exports.deleteProduct = deleteProduct;
const buyProducts = (products) => __awaiter(void 0, void 0, void 0, function* () {
    const results = [];
    for (const { id, quantity } of products) {
        const product = yield products_1.default.findById(id);
        if (!product) {
            throw new Error(`Product with id ${id} not found`);
        }
        if (product.stock < quantity) {
            throw new Error(`Not enough stock for product with id ${product.title}`);
        }
        product.stock -= quantity;
        yield product.save();
        results.push(product);
    }
    return results;
});
exports.buyProducts = buyProducts;
