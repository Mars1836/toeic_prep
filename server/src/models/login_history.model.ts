import mongoose from "mongoose";

/**
 * Login History Model
 * 
 * Lưu trữ toàn bộ lịch sử đăng nhập của users để:
 * - Track devices, IPs, locations đã sử dụng
 * - Detect anomalous login patterns
 * - Security audit và compliance
 */

export interface LoginHistoryAttr {
  userId: string;
  fingerprint: string;
  ip: string;
  location: string; // "City, Country" or "Unknown"
  browser: string;
  os: string;
  device: string; // "desktop", "mobile", "tablet"
  success: boolean;
  timestamp?: Date;
}

interface LoginHistoryDoc extends mongoose.Document {
  userId: string;
  fingerprint: string;
  ip: string;
  location: string;
  browser: string;
  os: string;
  device: string;
  success: boolean;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface LoginHistoryModel extends mongoose.Model<LoginHistoryDoc> {
  build(attrs: LoginHistoryAttr): LoginHistoryDoc;
}

const loginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    fingerprint: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      default: "Unknown",
    },
    browser: {
      type: String,
      required: true,
    },
    os: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      required: true,
      enum: ["desktop", "mobile", "tablet", "unknown"],
      default: "desktop",
    },
    success: {
      type: Boolean,
      required: true,
      default: true,
    },
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Compound indexes for efficient queries
loginHistorySchema.index({ userId: 1, timestamp: -1 }); // Query history by user, sorted by time
loginHistorySchema.index({ userId: 1, fingerprint: 1 }); // Check known devices
loginHistorySchema.index({ userId: 1, success: 1, timestamp: -1 }); // Query successful logins only

// Static method to build a new login history record
loginHistorySchema.statics.build = (attrs: LoginHistoryAttr) => {
  return new LoginHistory(attrs);
};

const LoginHistory = mongoose.model<LoginHistoryDoc, LoginHistoryModel>(
  "LoginHistory",
  loginHistorySchema
);

export { LoginHistory };
