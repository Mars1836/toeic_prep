"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toeicTestSessionStatusModel = exports.ToeicTestSessionStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
var ToeicTestSessionStatus;
(function (ToeicTestSessionStatus) {
    ToeicTestSessionStatus["PENDING"] = "pending";
    ToeicTestSessionStatus["STARTED"] = "started";
    ToeicTestSessionStatus["FINISHED"] = "finished";
    ToeicTestSessionStatus["EXPIRED"] = "expired";
    ToeicTestSessionStatus["CANCELLED"] = "cancelled";
})(ToeicTestSessionStatus || (exports.ToeicTestSessionStatus = ToeicTestSessionStatus = {}));
const toeicTestSessionStatusSchema = new Schema({
    toeicTestSessionId: {
        type: String,
        required: true,
        ref: "ToeicTestSession",
    },
    userId: { type: String, required: true, ref: "User" },
    status: {
        type: String,
        enum: Object.values(ToeicTestSessionStatus),
        required: true,
        default: ToeicTestSessionStatus.PENDING,
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
exports.toeicTestSessionStatusModel = mongoose_1.default.model("ToeicTestSessionStatus", toeicTestSessionStatusSchema);
