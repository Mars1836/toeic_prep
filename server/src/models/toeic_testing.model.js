"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toeicTestingModel = exports.TestStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
var TestStatus;
(function (TestStatus) {
    TestStatus["PENDING"] = "PENDING";
    TestStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TestStatus["COMPLETED"] = "COMPLETED";
    TestStatus["CANCELLED"] = "CANCELLED";
})(TestStatus || (exports.TestStatus = TestStatus = {}));
const toeicTestingSchema = new Schema({
    testId: { type: String, required: false, default: null },
    timeStart: { type: Date, required: true },
    timeEnd: { type: Date, required: true },
    status: {
        type: String,
        enum: Object.values(TestStatus),
        default: TestStatus.PENDING,
        required: true,
    },
    price: { type: Number, required: true }, // Giá tiền của kỳ thi
    testCenter: { type: String, required: true }, // Trung tâm thi
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
exports.toeicTestingModel = mongoose_1.default.model("ToeicTesting", toeicTestingSchema);
