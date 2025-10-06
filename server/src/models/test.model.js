"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../configs/enum");
const { Schema } = mongoose_1.default;
const testSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    url: {
        type: String,
        require: true,
    },
    type: {
        type: String,
        enum: enum_1.TestType,
        require: true,
    },
    attempts: {
        type: (Array),
        default: [],
    },
    numberOfParts: {
        type: Number,
    },
    parts: {
        type: [Number],
        default: [],
    },
    code: {
        type: String,
        require: true,
    },
    numberOfQuestions: {
        type: Number,
        require: true,
    },
    duration: {
        type: Number,
        require: true,
    },
    fileName: {
        type: String,
        require: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    difficulty: {
        type: String,
        default: "intermediate",
    },
}, {
    // collection: "Test_collection",
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.testModel = mongoose_1.default.model("Test", testSchema);
