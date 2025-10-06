import mongoose from "mongoose";

const { Schema } = mongoose;

export type AiChatRole = "user" | "model";

export interface AiChatMessageAttr {
  sessionId: string;
  role: AiChatRole;
  content: string;
}

export interface AiChatMessageDoc extends mongoose.Document {
  sessionId: string;
  role: AiChatRole;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiChatMessageModel extends mongoose.Model<AiChatMessageDoc> {}

const aiChatMessageSchema = new Schema(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AiChatSession",
    },
    role: {
      type: String,
      enum: ["user", "model"],
      required: true,
    },
    content: {
      type: String,
      required: true,
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

aiChatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export const aiChatMessageModel = mongoose.model<
  AiChatMessageDoc,
  AiChatMessageModel
>("AiChatMessage", aiChatMessageSchema);


