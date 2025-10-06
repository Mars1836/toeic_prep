"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const wordSchema = new Schema({
    word: {
        type: String,
        unique: true,
    },
    translation: {
        type: String,
    },
    description: {
        type: String,
    },
}, {
    // collection: "user_collection",
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.wordModel = mongoose_1.default.model("Word", wordSchema);
