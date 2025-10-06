"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.examResultModel = void 0;
// resultSchema.ts
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
// Định nghĩa schema cho Result
const examResultSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    sessionId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Session",
    },
    testId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Test",
    },
    numberOfQuestions: {
        type: Number,
        required: true,
    },
    numberOfUserAnswers: {
        type: Number,
        required: true,
    },
    numberOfReadingCorrectAnswers: {
        type: Number,
        required: true,
    },
    numberOfListeningCorrectAnswers: {
        type: Number,
        required: true,
    },
    numberOfCorrectAnswers: {
        type: Number,
        required: true,
    },
    secondTime: {
        type: Number,
        required: true, // Thời gian tính bằng giây
    },
    parts: {
        type: [Number],
        default: [],
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
// Tạo model từ schema
exports.examResultModel = mongoose_1.default.model("ExamResult", examResultSchema);
