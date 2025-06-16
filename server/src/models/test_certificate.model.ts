import mongoose from "mongoose";
const { Schema } = mongoose;

export interface TestCertificateAttr {
  userId: string;
  testId: string;
  score?: number;
  certificateNumber?: string;
  issueDate?: Date;
  expiryDate?: Date;
  status?: string;
}

export interface TestCertificateDoc extends mongoose.Document {
  userId: string;
  testId: string;
  score?: number;
  certificateNumber?: string;
  issueDate?: Date;
  expiryDate?: Date;
  status?: string;
}

export interface TestCertificateModel
  extends mongoose.Model<TestCertificateDoc> {}

const testCertificateSchema = new Schema(
  {
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

export const TestCertificate = mongoose.model<
  TestCertificateDoc,
  TestCertificateModel
>("TestCertificate", testCertificateSchema);
