import mongoose from "mongoose";
const { Schema } = mongoose;

export interface ToeicTestSessionAttr {
  testId: string;
  userIds: string[];
  toeicTestId: string;
  token: string;
  expiresAt?: Date;
}

export interface ToeicTestSessionDoc extends mongoose.Document {
  testId: string;
  userIds: string[];
  toeicTestId: string;
  token: string;
  expiresAt?: Date;
}

export interface ToeicTestSessionModel
  extends mongoose.Model<ToeicTestSessionDoc> {}

const toeicTestSessionSchema = new mongoose.Schema(
  {
    testId: { type: String, required: true, ref: "Test" },
    userIds: { type: [String], required: true },
    toeicTestId: { type: String, required: true, ref: "ToeicTesting" },
    token: { type: String, required: true },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
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

// Add TTL index on expiresAt field
toeicTestSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const toeicTestSessionModel = mongoose.model<
  ToeicTestSessionDoc,
  ToeicTestSessionModel
>("ToeicTestSession", toeicTestSessionSchema);
