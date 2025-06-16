import mongoose from "mongoose";
const { Schema } = mongoose;

export enum TestStatus {
  PENDING = "PENDING", // Chờ bắt đầu
  IN_PROGRESS = "IN_PROGRESS", // Đang làm bài
  COMPLETED = "COMPLETED", // Đã hoàn thành
  CANCELLED = "CANCELLED", // Đã hủy
}

export interface ToeicTestingAttr {
  testId?: string;
  timeStart: Date;
  timeEnd: Date;
  status: TestStatus;
  price: number; // Giá tiền của kỳ thi
  testCenter: string; // Trung tâm thi
}

export interface ToeicTestingDoc extends mongoose.Document {
  testId?: string;
  timeStart: Date;
  timeEnd: Date;
  status: TestStatus;
  price: number;
  testCenter: string;
}

export interface ToeicTestingModel extends mongoose.Model<ToeicTestingDoc> {}

const toeicTestingSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const toeicTestingModel = mongoose.model<
  ToeicTestingDoc,
  ToeicTestingModel
>("ToeicTesting", toeicTestingSchema);
