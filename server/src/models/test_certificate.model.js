"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCertificate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const testCertificateSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    testId: {
        type: Schema.Types.ObjectId,
        ref: "ToeicTesting",
        required: true,
    },
    score: {
        type: Number,
        min: 0,
        max: 990,
    },
    certificateNumber: {
        type: String,
        unique: true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    expiryDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["pending", "issued", "expired", "revoked"],
        default: "pending",
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
exports.TestCertificate = mongoose_1.default.model("TestCertificate", testCertificateSchema);
