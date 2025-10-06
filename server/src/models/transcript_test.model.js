"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcriptTestModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const transcriptTestSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    url: {
        type: String,
        require: true,
    },
    attempts: {
        type: (Array),
        default: [],
    },
    image: {
        type: String,
        default: "",
    },
    code: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        default: "",
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
exports.transcriptTestModel = mongoose_1.default.model("TranscriptTest", transcriptTestSchema);
