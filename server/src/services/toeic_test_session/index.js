"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const toeic_test_session_model_1 = require("../../models/toeic_test_session.model");
const test_registration_1 = __importDefault(require("../test_registration"));
const test_registration_model_1 = require("../../models/test_registration.model");
const toeic_testing_model_1 = require("../../models/toeic_testing.model");
const test_model_1 = require("../../models/test.model");
const utils_1 = require("../../utils");
const toeic_test_session_status_1 = require("../../models/toeic_test_session_status");
class ToeicTestSessionSrv {
    getRegistrationsByTestCenter(testCenterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return test_registration_1.default.getRegistrationsByTestCenter(testCenterId);
        });
    }
    extractUserIdsFromRegistrations(registrations) {
        return __awaiter(this, void 0, void 0, function* () {
            return registrations.map((registration) => registration.userId);
        });
    }
    createSessionData(testId, toeicTestId, userIds, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                testId,
                userIds,
                toeicTestId,
                token,
            };
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield toeic_test_session_model_1.toeicTestSessionModel.create(data);
            return session;
        });
    }
    createSessionWithRegistrations(testId, toeicTestId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all registrations for this toeic test
            const testing = yield toeic_testing_model_1.toeicTestingModel.findById(toeicTestId);
            console.log(testing);
            if (!testing) {
                throw new Error("No toeic testing found");
            }
            const test = yield test_model_1.testModel.findById(testId);
            if (!test) {
                throw new Error("No test found");
            }
            const registrations = yield test_registration_model_1.testRegistrationModel.find({
                examId: testing.id,
            });
            const existingSession = yield toeic_test_session_model_1.toeicTestSessionModel.findOne({
                toeicTestId,
            });
            if (existingSession) {
                throw new Error("Session already exists with id: " + existingSession._id);
            }
            // Extract userIds from registrations
            const userIds = yield this.extractUserIdsFromRegistrations(registrations);
            // Create session data
            const sessionData = yield this.createSessionData(testId, toeicTestId, userIds, (0, utils_1.createToken)({ testId, toeicTestId }, "2h"));
            // Create and return the session
            return yield this.create(sessionData);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return toeic_test_session_model_1.toeicTestSessionModel.findById(id);
        });
    }
    getAll() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const [sessions, total] = yield Promise.all([
                toeic_test_session_model_1.toeicTestSessionModel
                    .find()
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1 }),
                toeic_test_session_model_1.toeicTestSessionModel.countDocuments(),
            ]);
            return { sessions, total };
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield toeic_test_session_model_1.toeicTestSessionModel.findById(id);
            if (!session)
                return null;
            Object.assign(session, data);
            yield session.save();
            return session;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield toeic_test_session_model_1.toeicTestSessionModel.deleteOne({ _id: id });
            return result.deletedCount > 0;
        });
    }
    addParticipant(sessionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield toeic_test_session_model_1.toeicTestSessionModel.findById(sessionId);
            if (!session)
                return null;
            if (session.userIds.includes(userId)) {
                throw new Error("User already registered for this session");
            }
            session.userIds.push(userId);
            yield session.save();
            return session;
        });
    }
    removeParticipant(sessionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield toeic_test_session_model_1.toeicTestSessionModel.findById(sessionId);
            if (!session)
                return null;
            const userIndex = session.userIds.indexOf(userId);
            if (userIndex === -1) {
                throw new Error("User not found in session");
            }
            session.userIds.splice(userIndex, 1);
            yield session.save();
            return session;
        });
    }
    getSessionsByTestId(testId) {
        return __awaiter(this, void 0, void 0, function* () {
            return toeic_test_session_model_1.toeicTestSessionModel.find({ testId }).sort({ createdAt: -1 });
        });
    }
    getSessionsByTestingId(testingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return toeic_test_session_model_1.toeicTestSessionModel
                .find({ toeicTestId: testingId })
                .sort({ createdAt: -1 })
                .populate("testId")
                .populate("toeicTestId");
        });
    }
    getSessionsByUserId(userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (params.page - 1) * params.limit;
            const [sessions, total] = yield Promise.all([
                toeic_test_session_model_1.toeicTestSessionModel
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
                toeic_test_session_model_1.toeicTestSessionModel.countDocuments({ userIds: userId }),
            ]);
            // Lọc bỏ session nếu user đã có status khác pending
            const filteredSessions = yield Promise.all(sessions.map((session) => __awaiter(this, void 0, void 0, function* () {
                const statusDoc = yield toeic_test_session_status_1.toeicTestSessionStatusModel.findOne({
                    toeicTestSessionId: session._id,
                    userId,
                    status: { $ne: toeic_test_session_status_1.ToeicTestSessionStatus.PENDING },
                });
                return statusDoc ? null : session;
            })));
            const validSessions = filteredSessions.filter(Boolean);
            // Transform the response to rename fields
            const transformedSessions = validSessions.map((session) => {
                const sessionObj = session === null || session === void 0 ? void 0 : session.toObject();
                if (!sessionObj)
                    return null;
                return {
                    id: sessionObj._id,
                    userIds: sessionObj.userIds,
                    test: (0, utils_1.transformId)(sessionObj.testId),
                    toeicTest: (0, utils_1.transformId)(sessionObj.toeicTestId),
                    token: sessionObj.token,
                };
            });
            return { sessions: transformedSessions, total: transformedSessions.length };
        });
    }
    getSessionByUserIdAndId(userId, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield toeic_test_session_model_1.toeicTestSessionModel
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
            return (0, utils_1.transformId)(session);
        });
    }
    getExamByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { testId, toeicTestId } = (0, utils_1.decodeToken)(token);
            if (!testId || !toeicTestId) {
                throw new Error("Invalid token");
            }
            const test = yield test_model_1.testModel.findById(testId);
            if (!test) {
                throw new Error("Test not found");
            }
            const toeicTest = yield toeic_testing_model_1.toeicTestingModel.findById(toeicTestId);
            if (!toeicTest) {
                throw new Error("Toeic test not found");
            }
            return { test, exam: toeicTest };
        });
    }
}
exports.default = new ToeicTestSessionSrv();
