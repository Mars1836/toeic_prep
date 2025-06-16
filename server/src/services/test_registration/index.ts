import { TestRegistrationAttr } from "../../models/test_registration.model";
import { testRegistrationModel } from "../../models/test_registration.model";
import { TestStatus } from "../../models/toeic_testing.model";
import ToeicTestingSrv from "../toeic_testing";
interface PaginatedResponse<T> {
  registrations: T[];
  total: number;
}

const TestRegistrationSrv = {
  async create(data: TestRegistrationAttr) {
    const toeicTest = await ToeicTestingSrv.getById(data.examId);
    if (!toeicTest) {
      throw new Error("TOEIC test not found");
    }
    const existingRegistration = await testRegistrationModel.findOne({
      userId: data.userId,
      examId: data.examId,
    });
    if (existingRegistration) {
      throw new Error("Registration already exists");
    }

    const registration = await testRegistrationModel.create(data);
    return registration;
  },

  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<any>> {
    const skip = (page - 1) * limit;
    const [registrations, total] = await Promise.all([
      testRegistrationModel
        .find()
        .populate("userId", "fullName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      testRegistrationModel.countDocuments(),
    ]);

    return { registrations, total };
  },

  async getById(id: string) {
    const registration = await testRegistrationModel
      .findById(id)
      .populate("userId", "fullName email");
    return registration;
  },

  async getByUserId(userId: string) {
    const registrations = await testRegistrationModel
      .find({ userId })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
    return registrations;
  },

  async getUpcomingRegistrations() {
    const currentDate = new Date();
    const registrations = await testRegistrationModel
      .find({
        "examInfo.examDate": { $gte: currentDate.toISOString().split("T")[0] },
        "examInfo.status": { $in: [TestStatus.PENDING] },
      })
      .populate("userId", "fullName email");
    return registrations;
  },

  async updateStatus(id: string, status: string) {
    const registration = await testRegistrationModel
      .findByIdAndUpdate(id, { "examInfo.status": status }, { new: true })
      .populate("userId", "fullName email");
    return registration;
  },

  async getRegistrationsByDateRange(startDate: string, endDate: string) {
    const registrations = await testRegistrationModel
      .find({
        "examInfo.examDate": {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .populate("userId", "fullName email");
    return registrations;
  },

  async getRegistrationsByStatus(status: string) {
    const registrations = await testRegistrationModel
      .find({
        "examInfo.status": status,
      })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
    return registrations;
  },

  async getRegistrationsByTestCenter(testCenter: string) {
    const registrations = await testRegistrationModel
      .find({
        "examInfo.testCenter": testCenter,
      })
      .populate("userId", "fullName email")
      .sort({ "examInfo.examDate": 1 });
    return registrations;
  },
};

export default TestRegistrationSrv;
