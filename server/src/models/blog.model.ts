import mongoose from "mongoose";
import { PartOfSpeech } from "../configs/enum";

const { Schema } = mongoose;

// Định nghĩa interface cho flashcard
export interface BlogAttr {
  title: string;
  content: string;
  author: string;
  image: string;
  view: number;
}

// Định nghĩa interface cho tài liệu flashcard (Document)
export interface BlogDoc extends mongoose.Document {
  title: string;
  content: string;
  author: string;
  image: string;
  view: number;
}

// Định nghĩa interface cho model flashcard
export interface BlogModel extends mongoose.Model<BlogDoc> {}

// Định nghĩa schema cho flashcard
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    view: {
      type: Number,
      default: 0,
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

export const blogModel = mongoose.model<BlogDoc, BlogModel>("Blog", blogSchema);
