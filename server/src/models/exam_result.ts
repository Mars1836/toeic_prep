// resultSchema.ts
import mongoose from "mongoose";
import { TestType } from "../configs/enum";

const { Schema } = mongoose;

// Định nghĩa interface cho Result
export interface ExamResultAttr {
  userId: string;
  sessionId: string;
  testId: string;
  numberOfQuestions: number;
  numberOfUserAnswers: number;
  numberOfReadingCorrectAnswers: number;
  numberOfListeningCorrectAnswers: number;
  numberOfCorrectAnswers: number;
  secondTime: number; // Thời gian (tính bằng giây)
  parts: number[];
}

// Định nghĩa interface cho tài liệu Result (Document)
export interface ResultDoc extends mongoose.Document {
  userId: string;
  sessionId: string;
  testId: string;
  numberOfQuestions: number;
  numberOfUserAnswers: number;
  numberOfReadingCorrectAnswers: number;
  numberOfListeningCorrectAnswers: number;
  numberOfCorrectAnswers: number;
  secondTime: number; // Thời gian (tính bằng giây)
  parts: number[];
  createdAt: Date;
  updatedAt: Date;
}

// Định nghĩa interface cho model Result
export interface ResultModel extends mongoose.Model<ResultDoc> {}

// Định nghĩa schema cho Result
const examResultSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Session",
    },
    testId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Test",
    },
    numberOfQuestions: {
      type: Number,
      required: true,
    },
    numberOfUserAnswers: {
      type: Number,
      required: true,
    },
    numberOfReadingCorrectAnswers: {
      type: Number,
      required: true,
    },
    numberOfListeningCorrectAnswers: {
      type: Number,
      required: true,
    },
    numberOfCorrectAnswers: {
      type: Number,
      required: true,
    },
    secondTime: {
      type: Number,
      required: true, // Thời gian tính bằng giây
    },
    parts: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; // Tạo trường id từ _id
        delete ret._id; // Xóa trường _id
        delete ret.__v; // Xóa trường __v
      },
    },
  }
);

// Tạo model từ schema
export const examResultModel = mongoose.model<ResultDoc, ResultModel>(
  "ExamResult",
  examResultSchema
);
