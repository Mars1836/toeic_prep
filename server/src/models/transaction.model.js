"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../configs/enum");
const { Schema } = mongoose_1.default;
const transactionSchema = new Schema({
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "VND" },
    type: { type: String, required: true },
    description: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    providerId: { type: String, required: true },
    status: {
        type: String,
        required: true,
        default: enum_1.TransactionStatus.pending,
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
exports.transactionModel = mongoose_1.default.model("Transaction", transactionSchema);
