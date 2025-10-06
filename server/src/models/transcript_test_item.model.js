"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcriptTestItemModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const transcriptTestItemSchema = new Schema({
    transcriptTestId: {
        type: String,
        require: true,
        ref: "TranscriptTest",
    },
    audioUrl: {
        type: String,
        require: true,
    },
    transcript: {
        type: String,
        require: true,
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
exports.transcriptTestItemModel = mongoose_1.default.model("TranscriptTestItem", transcriptTestItemSchema);
