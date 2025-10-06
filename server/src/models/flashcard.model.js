"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flashcardModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
// Định nghĩa schema cho flashcard
const flashcardSchema = new Schema({
    setFlashcardId: {
        type: Schema.Types.ObjectId,
        ref: "SetFlashcard",
        required: true,
    },
    word: {
        type: String,
        required: true,
    },
    translation: {
        type: String,
        required: true,
    },
    definition: {
        type: String,
    },
    exampleSentence: {
        type: [String], // Mảng chuỗi
    },
    note: {
        type: String,
    },
    partOfSpeech: {
        type: [String], // Thay đổi thành mảng chuỗi
    },
    pronunciation: {
        type: String,
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
exports.flashcardModel = mongoose_1.default.model("Flashcard", flashcardSchema);
