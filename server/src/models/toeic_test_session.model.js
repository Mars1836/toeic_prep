"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toeicTestSessionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const toeicTestSessionSchema = new mongoose_1.default.Schema({
    testId: { type: String, required: true, ref: "Test" },
    userIds: { type: [String], required: true },
    toeicTestId: { type: String, required: true, ref: "ToeicTesting" },
    token: { type: String, required: true },
    expiresAt: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
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
// Add TTL index on expiresAt field
toeicTestSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.toeicTestSessionModel = mongoose_1.default.model("ToeicTestSession", toeicTestSessionSchema);
