import mongoose from "mongoose";
import { AccountType, Role, UserStatus } from "../configs/enum";
import { encryptionPlugin } from "../plugins/encryption.plugin";
const { Schema } = mongoose;

interface UserScore {
  reading: number;
  listening: number;
}

export interface UserTargetScore extends UserScore {}
export interface UserActualScore extends UserScore {}
export interface UserAttr {
  email?: string;
  password?: string;
  name: string;
  facebookId?: string;
  googleId?: string;
  role?: Role;
  bio?: string;
  status?: UserStatus;
  upgradeExpiredDate?: Date;
  avatar?: string;
  targetScore?: UserTargetScore;
  actualScore?: UserActualScore;
  createdAt?: Date;
}
export interface UserDoc extends mongoose.Document {
  email?: string;
  password?: string;
  name: string;
  facebookId?: string;
  googleId?: string;
  role?: Role;
  bio?: string;
  status?: UserStatus;
  upgradeExpiredDate?: Date;
  avatar?: string;
  targetScore?: UserTargetScore;
  actualScore?: UserActualScore;
  createdAt?: Date;
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
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.user,
    },
    upgradeExpiredDate: {
      type: Date,
      default: null,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    targetScore: {
      type: Object,
      default: null,
    },
    actualScore: {
      type: Object,
      default: null,
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
        delete ret.password; // Never expose password
      },
    },
  }
);
userSchema.methods.isExpiredUpgrade = function () {
  // Kiểm tra nếu upgradeExpiredDate là null
  if (!this.upgradeExpiredDate) {
    return true; // Có thể xử lý theo yêu cầu, ví dụ coi là chưa hết hạn
  }

  // So sánh ngày hiện tại với upgradeExpiredDate
  const currentDate = new Date();
  return currentDate > this.upgradeExpiredDate;
};

// ============================================
// ENCRYPTION PLUGIN
// ============================================
// Tự động encrypt/decrypt các fields nhạy cảm
userSchema.plugin(encryptionPlugin, {
  fields: ['email', 'name', 'bio'],
  debug: process.env.APP_ENV === 'dev'
});

export const userModel = mongoose.model<UserDoc, UserModel>("User", userSchema);
