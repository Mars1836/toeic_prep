"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningSetModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
// Schema definition for LearningSet
const learningSetSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    setFlashcardId: {
        type: Schema.Types.ObjectId,
        ref: "SetFlashcard",
        required: true,
    },
    status: {
        type: String,
    },
    lastStudied: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
    toObject: {
        virtuals: true,
    },
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
learningSetSchema.virtual("learningFlashcards", {
    ref: "LearningFlashcard",
    localField: "_id",
    foreignField: "learningSetId",
});
// Create model from schema
exports.learningSetModel = mongoose_1.default.model("LearningSet", learningSetSchema);
