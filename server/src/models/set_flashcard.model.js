"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFlashcardModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../configs/enum");
const { Schema } = mongoose_1.default;
const SetFlashcardSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    userRole: {
        type: String,
        enum: Object.values(enum_1.Role),
        required: true,
    },
    numberOfFlashcards: {
        type: Number,
        min: 0,
        default: 0,
    },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.setFlashcardModel = mongoose_1.default.model("SetFlashcard", SetFlashcardSchema);
