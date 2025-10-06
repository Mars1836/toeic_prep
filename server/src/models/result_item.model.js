"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultItemModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../configs/enum");
const { Schema } = mongoose_1.default;
// Định nghĩa schema cho ResultItem
const resultItemSchema = new Schema({
    useranswer: {
        type: String,
        required: true,
    },
    correctanswer: {
        type: String,
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId, // Mảng chuỗi ID người dùng
        required: false,
        ref: "User",
    },
    questionNum: {
        type: String,
        required: true,
    },
    testId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Test",
    },
    testType: {
        type: String,
        enum: Object.values(enum_1.TestType),
        required: false,
    },
    resultId: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Result",
    },
    part: {
        type: Number,
    },
    isReading: {
        type: Boolean,
        default: true,
    },
    timeSecond: {
        type: Number,
        default: 0,
    },
    questionCategory: {
        type: [String], // Đảm bảo đây là một mảng các chuỗi
        default: [], // Giá trị mặc định là một mảng rỗng
    },
    examResultId: {
        required: false,
        type: Schema.Types.ObjectId,
        ref: "ExamResult",
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
exports.resultItemModel = mongoose_1.default.model("ResultItem", resultItemSchema);
