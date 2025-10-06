"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.learningFlashcardModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
// Schema definition for LearningFlashcard
const learningFlashcardSchema = new Schema({
    flashcardId: {
        type: Schema.Types.ObjectId,
        ref: "Flashcard",
        unique: true,
        required: true,
    },
    retentionScore: {
        type: Number,
        default: 0,
    },
    decayScore: {
        type: Number,
        default: 0,
    },
    lastStudied: {
        type: Date,
        default: Date.now,
    },
    studyTime: {
        type: Number,
        default: 0,
    },
    EF: {
        type: Number,
        default: 1.8,
    },
    learningSetId: {
        type: String,
        required: true,
        ref: "LearningSet",
    },
    optimalTime: {
        type: Date,
        default: null,
    },
    interval: {
        type: Number,
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
// Create model from schema
exports.learningFlashcardModel = mongoose_1.default.model("LearningFlashcard", learningFlashcardSchema);
