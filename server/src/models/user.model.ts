import mongoose from "mongoose";
import { AccountType, UserStatus } from "../configs/enum";
const { Schema } = mongoose;
export interface UserAttr {
  email?: string;
  password?: string;
  name: string;
  facebookId?: string;
  googleId?: string;
}
export interface UserDoc extends mongoose.Document {
  email?: string;
  password?: string;
  name: string;
  facebookId?: string;
  googleId?: string;
}
export interface UserModel extends mongoose.Model<UserDoc> {}
const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.active,
    },

    accountType: {
      type: String,
      enum: Object.values(AccountType), // Các mức người dùng
      default: AccountType.basic,
    },
  },
  {
    // collection: "user_collection",
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
export const userModel = mongoose.model<UserDoc, UserModel>("user", userSchema);
