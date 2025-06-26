import {
  ToeicTestSessionAttr,
  ToeicTestSessionDoc,
  toeicTestSessionModel,
} from "../../models/toeic_test_session.model";
import TestRegistrationSrv from "../test_registration";
import {
  TestRegistrationDoc,
  testRegistrationModel,
} from "../../models/test_registration.model";
import { toeicTestingModel } from "../../models/toeic_testing.model";
import { testModel } from "../../models/test.model";
import {
  createToken,
  decodeToken,
  PaginationParams,
  transformId,
  verifyToken,
} from "../../utils";
import {
  toeicTestSessionStatusModel,
  ToeicTestSessionStatus,
} from "../../models/toeic_test_session_status";

class ToeicTestSessionSrv {
  private async getRegistrationsByTestCenter(
    testCenterId: string
  ): Promise<TestRegistrationDoc[]> {
    return TestRegistrationSrv.getRegistrationsByTestCenter(testCenterId);
  }

  private async extractUserIdsFromRegistrations(
    registrations: TestRegistrationDoc[]
  ): Promise<string[]> {
    return registrations.map((registration) => registration.userId);
  }

  private async createSessionData(
    testId: string,
    toeicTestId: string,
    userIds: string[],
    token: string
  ): Promise<ToeicTestSessionAttr> {
    return {
      testId,
      userIds,
      toeicTestId,
      token,
    };
  }

  private async create(
    data: ToeicTestSessionAttr
  ): Promise<ToeicTestSessionDoc> {
    const session = await toeicTestSessionModel.create(data);
    return session;
  }

  async createSessionWithRegistrations(
    testId: string,
    toeicTestId: string
  ): Promise<ToeicTestSessionDoc> {
    // Get all registrations for this toeic test
    const testing = await toeicTestingModel.findById(toeicTestId);
    console.log(testing);
    if (!testing) {
      throw new Error("No toeic testing found");
    }
    const test = await testModel.findById(testId);
    if (!test) {
      throw new Error("No test found");
    }
    const registrations = await testRegistrationModel.find({
      examId: testing.id,
    });
    const existingSession = await toeicTestSessionModel.findOne({
      toeicTestId,
    });
    if (existingSession) {
      throw new Error("Session already exists with id: " + existingSession._id);
    }
    // Extract userIds from registrations
    const userIds = await this.extractUserIdsFromRegistrations(registrations);

    // Create session data
    const sessionData = await this.createSessionData(
      testId,
      toeicTestId,
      userIds,
      createToken({ testId, toeicTestId }, "2h")
    );

    // Create and return the session
    return await this.create(sessionData);
  }

  async getById(id: string): Promise<ToeicTestSessionDoc | null> {
    return toeicTestSessionModel.findById(id);
  }

  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ sessions: ToeicTestSessionDoc[]; total: number }> {
    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      toeicTestSessionModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      toeicTestSessionModel.countDocuments(),
    ]);
    return { sessions, total };
  }

  async update(
    id: string,
    data: Partial<ToeicTestSessionAttr>
  ): Promise<ToeicTestSessionDoc | null> {
    const session = await toeicTestSessionModel.findById(id);
    if (!session) return null;

    Object.assign(session, data);
    await session.save();
    return session;
  }

  async delete(id: string): Promise<boolean> {
    const result = await toeicTestSessionModel.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async addParticipant(
    sessionId: string,
    userId: string
  ): Promise<ToeicTestSessionDoc | null> {
    const session = await toeicTestSessionModel.findById(sessionId);
    if (!session) return null;

    if (session.userIds.includes(userId)) {
      throw new Error("User already registered for this session");
    }

    session.userIds.push(userId);
    await session.save();
    return session;
  }

  async removeParticipant(
    sessionId: string,
    userId: string
  ): Promise<ToeicTestSessionDoc | null> {
    const session = await toeicTestSessionModel.findById(sessionId);
    if (!session) return null;

    const userIndex = session.userIds.indexOf(userId);
    if (userIndex === -1) {
      throw new Error("User not found in session");
    }

    session.userIds.splice(userIndex, 1);
    await session.save();
    return session;
  }

  async getSessionsByTestId(testId: string): Promise<ToeicTestSessionDoc[]> {
    return toeicTestSessionModel.find({ testId }).sort({ createdAt: -1 });
  }

  async getSessionsByTestingId(
    testingId: string
  ): Promise<ToeicTestSessionDoc[]> {
    return toeicTestSessionModel
      .find({ toeicTestId: testingId })
      .sort({ createdAt: -1 })
      .populate("testId")
      .populate("toeicTestId");
  }

  async getSessionsByUserId(
    userId: string,
    params: PaginationParams
  ): Promise<{ sessions: any[]; total: number }> {
    const skip = (params.page - 1) * params.limit;
    const [sessions, total] = await Promise.all([
      toeicTestSessionModel
        .find({ userIds: userId })
        .populate({
          path: "testId",
          select: "title duration numberOfQuestions numberOfParts parts",
        })
        .populate({
          path: "toeicTestId",
          select: "timeStart timeEnd testCenter price",
        })
        .skip(skip)
        .limit(params.limit)
        .sort({ createdAt: -1 }),
      toeicTestSessionModel.countDocuments({ userIds: userId }),
    ]);

    // Lọc bỏ session nếu user đã có status khác pending
    const filteredSessions = await Promise.all(
      sessions.map(async (session) => {
        const statusDoc = await toeicTestSessionStatusModel.findOne({
          toeicTestSessionId: session._id,
          userId,
          status: { $ne: ToeicTestSessionStatus.PENDING },
        });
        return statusDoc ? null : session;
      })
    );
    const validSessions = filteredSessions.filter(Boolean);

    // Transform the response to rename fields
    const transformedSessions = validSessions.map((session) => {
      const sessionObj = session?.toObject();
      if (!sessionObj) return null;
      return {
        id: sessionObj._id,
        userIds: sessionObj.userIds,
        test: transformId(sessionObj.testId),
        toeicTest: transformId(sessionObj.toeicTestId),
        token: sessionObj.token,
      };
    });

    return { sessions: transformedSessions, total: transformedSessions.length };
  }
  async getSessionByUserIdAndId(userId: string, id: string) {
    const session = await toeicTestSessionModel
      .findOne({
        userIds: userId,
        _id: id,
      })
      .populate({
        path: "testId",
        select: "title duration numberOfQuestions numberOfParts parts",
      })
      .populate({
        path: "toeicTestId",
        select: "timeStart timeEnd testCenter price",
      });
    return transformId(session);
  }
  async getExamByToken(token: string) {
    const { testId, toeicTestId } = decodeToken(token) as any;
    if (!testId || !toeicTestId) {
      throw new Error("Invalid token");
    }
    const test = await testModel.findById(testId);
    if (!test) {
      throw new Error("Test not found");
    }
    const toeicTest = await toeicTestingModel.findById(toeicTestId);
    if (!toeicTest) {
      throw new Error("Toeic test not found");
    }
    return { test, exam: toeicTest };
  }
}

export default new ToeicTestSessionSrv();
