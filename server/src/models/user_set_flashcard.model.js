"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSetFlashcardModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../configs/enum");
const { Schema } = mongoose_1.default;
const userSetFlashcardSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    setFlashcardId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "SetFlashcard",
    },
    status: {
        type: String,
        enum: Object.values(enum_1.StatusUserSetFC),
        required: true,
    },
}, {
    // collection: "UserSetFlashcard_collection",
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.userSetFlashcardModel = mongoose_1.default.model("UserSetFlashcard", userSetFlashcardSchema);
