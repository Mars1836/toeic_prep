import {
  ToeicTestingAttr,
  ToeicTestingDoc,
  toeicTestingModel,
} from "../../models/toeic_testing.model";
import { TestStatus } from "../../models/toeic_testing.model";
import moment from "moment";
import { transformId, PaginationParams } from "../../utils";
import { testRegistrationModel } from "../../models/test_registration.model";

class ToeicTestingSrv {
  async create(data: ToeicTestingAttr): Promise<ToeicTestingDoc> {
    const toeicTest = await toeicTestingModel.create(data);
    return toeicTest;
  }

  async createMany(dataList: ToeicTestingAttr[]): Promise<ToeicTestingDoc[]> {
    const toeicTests = await toeicTestingModel.insertMany(dataList);
    return toeicTests;
  }

  async getById(id: string): Promise<ToeicTestingDoc | null> {
    return toeicTestingModel.findById(id);
  }

  async getAll(
    params: PaginationParams
  ): Promise<{ tests: ToeicTestingDoc[]; total: number }> {
    const skip = (params.page - 1) * params.limit;
    const [tests, total] = await Promise.all([
      toeicTestingModel
        .find()
        .skip(skip)
        .limit(params.limit)
        .sort({ createdAt: -1 }),
      toeicTestingModel.countDocuments(),
    ]);
    return { tests, total };
  }

  async update(
    id: string,
    data: Partial<ToeicTestingAttr>
  ): Promise<ToeicTestingDoc | null> {
    const toeicTest = await toeicTestingModel.findById(id);
    if (!toeicTest) return null;

    Object.assign(toeicTest, data);
    await toeicTest.save();
    return toeicTest;
  }

  async delete(id: string): Promise<boolean> {
    const result = await toeicTestingModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async getUpcomingTests(): Promise<ToeicTestingDoc[]> {
    const now = new Date();
    return toeicTestingModel
      .find({
        timeStart: { $gt: now },
        status: "PENDING",
      })
      .sort({ timeStart: 1 });
  }

  async getTestsByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ToeicTestingDoc[]> {
    return toeicTestingModel
      .find({
        timeStart: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      })
      .sort({ timeStart: 1 });
  }

  async getTestsByTestCenter(testCenter: string): Promise<ToeicTestingDoc[]> {
    return toeicTestingModel.find({ testCenter }).sort({ timeStart: -1 });
  }

  async getTestsByPriceRange(
    minPrice: number,
    maxPrice: number
  ): Promise<ToeicTestingDoc[]> {
    return toeicTestingModel
      .find({
        price: {
          $gte: minPrice,
          $lte: maxPrice,
        },
      })
      .sort({ price: 1 });
  }

  async getTestsByFilter(
    filters: any,
    params: PaginationParams
  ): Promise<{ tests: ToeicTestingDoc[]; total: number }> {
    const skip = (params.page - 1) * params.limit;
    const [tests, total] = await Promise.all([
      toeicTestingModel
        .find(filters)
        .skip(skip)
        .limit(params.limit)
        .sort({ createdAt: -1 }),
      toeicTestingModel.countDocuments(filters),
    ]);
    return { tests, total };
  }

  // Helper function to format dates in response
  formatDate(test: any) {
    if (!test) return null;

    const formatted = test;
    // Keep original date format in database, only format for response
    formatted.timeStart = moment(test.timeStart).format("YYYY-MM-DD HH:mm:ss");
    formatted.timeEnd = moment(test.timeEnd).format("YYYY-MM-DD HH:mm:ss");
    formatted.createdAt = moment(test.createdAt).format("YYYY-MM-DD HH:mm:ss");
    formatted.updatedAt = moment(test.updatedAt).format("YYYY-MM-DD HH:mm:ss");

    return formatted;
  }
  async getPendingTestsByUser(
    userId: string,
    params: PaginationParams
  ): Promise<{ tests: any[]; total: number }> {
    const skip = (params.page - 1) * params.limit;

    // Lấy tất cả các kỳ thi pending và đăng ký của user trong một lần query
    const [tests, registrations, total] = await Promise.all([
      toeicTestingModel
        .find({
          status: TestStatus.PENDING,
        })
        .skip(skip)
        .limit(params.limit)
        .sort({ createdAt: -1 }),
      testRegistrationModel.find({
        userId: userId,
      }),
      toeicTestingModel.countDocuments({
        status: TestStatus.PENDING,
      }),
    ]);

    // Tạo map để lookup nhanh
    const registrationMap = new Map(
      registrations.map((reg) => [reg.examId, true])
    );

    // Thêm trường isRegister cho mỗi kỳ thi
    const testsWithRegisterStatus = tests.map((test) => {
      const testObj = transformId(test.toObject());
      return {
        ...testObj,
        isRegister: registrationMap.has(test.id),
      };
    });

    return { tests: testsWithRegisterStatus, total };
  }
}

export default new ToeicTestingSrv();
