"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enum_1 = require("../configs/enum");
const { Schema } = mongoose_1.default;
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(enum_1.UserStatus),
        default: enum_1.UserStatus.active,
    },
    accountType: {
        type: String,
        enum: Object.values(enum_1.AccountType), // Các mức người dùng
        default: enum_1.AccountType.basic,
    },
    role: {
        type: String,
        enum: Object.values(enum_1.Role),
        default: enum_1.Role.user,
    },
    upgradeExpiredDate: {
        type: Date,
        default: null,
    },
    bio: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    targetScore: {
        type: Object,
        default: null,
    },
    actualScore: {
        type: Object,
        default: null,
    },
}, {
    // collection: "user_collection",
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
userSchema.methods.isExpiredUpgrade = function () {
    // Kiểm tra nếu upgradeExpiredDate là null
    if (!this.upgradeExpiredDate) {
        return true; // Có thể xử lý theo yêu cầu, ví dụ coi là chưa hết hạn
    }
    // So sánh ngày hiện tại với upgradeExpiredDate
    const currentDate = new Date();
    return currentDate > this.upgradeExpiredDate;
};
exports.userModel = mongoose_1.default.model("User", userSchema);
