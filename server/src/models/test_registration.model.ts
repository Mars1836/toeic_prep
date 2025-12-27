import mongoose from "mongoose";
import { encryptionPlugin } from "../plugins/encryption.plugin";
const { Schema } = mongoose;

export interface TestRegistrationAttr {
  userId: string;
  examId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    idNumber: string;
  };
}

export interface TestRegistrationDoc extends mongoose.Document {
  userId: string;
  examId: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    idNumber: string;
  };
}

export interface TestRegistrationModel
  extends mongoose.Model<TestRegistrationDoc> {}

const testRegistrationSchema = new Schema(
  {
    userId: { type: String, required: true },
    examId: { type: String, required: true },
    personalInfo: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      dateOfBirth: { type: String, required: true },
      idNumber: { type: String, required: true },
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

// ============================================
// ENCRYPTION PLUGIN
// ============================================
// Mã hóa thông tin cá nhân CỰC KỲ NHẠY CẢM
testRegistrationSchema.plugin(encryptionPlugin, {
  fields: [
    'personalInfo.phone',      // Số điện thoại
    'personalInfo.idNumber',   // Số CMND/CCCD - CỰC KỲ NHẠY CẢM
    'personalInfo.email',      // Email
    'personalInfo.dateOfBirth' // Ngày sinh
  ],
  debug: process.env.APP_ENV === 'dev'
});

export const testRegistrationModel = mongoose.model<
  TestRegistrationDoc,
  TestRegistrationModel
>("TestRegistration", testRegistrationSchema);
