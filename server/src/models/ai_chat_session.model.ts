import mongoose from "mongoose";

const { Schema } = mongoose;

export type AiChatRole = "user" | "model";

export interface AiChatSessionAttr {
  userId: string;
  title?: string;
  modelName?: string;
}

export interface AiChatSessionDoc extends mongoose.Document {
  userId: string;
  title?: string;
  modelName?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiChatSessionModel extends mongoose.Model<AiChatSessionDoc> {}

const aiChatSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      default: "New chat",
    },
    modelName: {
      type: String,
      default: "gemini-2.5-flash",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
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

export const aiChatSessionModel = mongoose.model<
  AiChatSessionDoc,
  AiChatSessionModel
>("AiChatSession", aiChatSessionSchema);


