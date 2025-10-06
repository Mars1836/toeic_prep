"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiChatMessageModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const aiChatMessageSchema = new Schema({
    sessionId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "AiChatSession",
    },
    role: {
        type: String,
        enum: ["user", "model"],
        required: true,
    },
    content: {
        type: String,
        required: true,
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
aiChatMessageSchema.index({ sessionId: 1, createdAt: 1 });
exports.aiChatMessageModel = mongoose_1.default.model("AiChatMessage", aiChatMessageSchema);
