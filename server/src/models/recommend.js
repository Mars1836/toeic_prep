"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recommendModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
// Định nghĩa schema cho flashcard
const recommendSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    targetScore: {
        type: Object,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id; // Tạo trường id từ _id
            delete ret._id; // Xóa trường _id
            delete ret.__v; // Xóa trường __v
        },
    },
});
exports.recommendModel = mongoose_1.default.model("Recommend", recommendSchema);
