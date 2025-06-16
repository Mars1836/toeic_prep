import mongoose from "mongoose";
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

export const testRegistrationModel = mongoose.model<
  TestRegistrationDoc,
  TestRegistrationModel
>("TestRegistration", testRegistrationSchema);
