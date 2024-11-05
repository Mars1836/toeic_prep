import mongoose from "mongoose";
import { AccountType, TestType } from "../configs/enum";
const { Schema } = mongoose;
export interface TestAttempt {
  userId: string;
  times: number;
}
export interface TestAttr {
  title: string;
  url: string;
  type: TestType;
  attempts: TestAttempt[];
}

export interface TestDoc extends mongoose.Document {
  title: string;
  url: string;
  type: TestType;
  attempts: TestAttempt[];
}
export interface TestModel extends mongoose.Model<TestDoc> {}
const testSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      enum: TestType,
      require: true,
    },
    attempts: {
      type: Array<TestAttempt>,
      default: [],
    },
  },
  {
    // collection: "Test_collection",
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
export const testModel = mongoose.model<TestDoc, TestModel>("Test", testSchema);
