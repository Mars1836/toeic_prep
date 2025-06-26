import mongoose from "mongoose";
const { Schema } = mongoose;

export enum ToeicTestSessionStatus {
  PENDING = "pending",
  STARTED = "started",
  FINISHED = "finished",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

export interface ToeicTestSessionStatusAttr {
  toeicTestSessionId: string;
  userId: string;
  status: ToeicTestSessionStatus;
}

export interface ToeicTestSessionStatusDoc extends mongoose.Document {
  toeicTestSessionId: string;
  userId: string;
  status: ToeicTestSessionStatus;
}

export interface ToeicTestSessionStatusModel
  extends mongoose.Model<ToeicTestSessionStatusDoc> {}

const toeicTestSessionStatusSchema = new Schema(
  {
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

export const toeicTestSessionStatusModel = mongoose.model<
  ToeicTestSessionStatusDoc,
  ToeicTestSessionStatusModel
>("ToeicTestSessionStatus", toeicTestSessionStatusSchema);
