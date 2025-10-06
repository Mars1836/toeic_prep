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
const bad_request_error_1 = require("../../errors/bad_request_error");
const exam_result_1 = require("../../models/exam_result");
const test_model_1 = require("../../models/test.model");
const repos_1 = __importDefault(require("../result_item/repos"));
const axios_1 = __importDefault(require("axios"));
const repos_2 = __importDefault(require("../test/repos"));
const utils_1 = require("../../utils");
const test_registration_model_1 = require("../../models/test_registration.model");
const toeic_test_session_model_1 = require("../../models/toeic_test_session.model");
const nodemailer_1 = require("../../configs/nodemailer");
const user_model_1 = require("../../models/user.model");
const toeic_test_session_status_1 = require("../../models/toeic_test_session_status");
var Skill;
(function (Skill) {
    Skill["Reading"] = "reading";
    Skill["Listening"] = "listening";
})(Skill || (Skill = {}));
const mapSkill = {
    [Skill.Reading]: [5, 6, 7],
    [Skill.Listening]: [1, 2, 3, 4],
};
var ExamResultSrv;
(function (ExamResultSrv) {
    function create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield repos_2.default.checkExist(data.testId);
            if (!isExist) {
                throw new bad_request_error_1.BadRequestError("Bài test không tồn tại.");
            }
            const newResult = yield exam_result_1.examResultModel.create(data);
            return newResult;
        });
    }
    ExamResultSrv.create = create;
    function creataWithItems(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield test_model_1.testModel.findById(data.rs.testId);
            if (!test) {
                throw new bad_request_error_1.BadRequestError("Bài test không tồn tại.");
            }
            data.rs.testId = test.id;
            data.rs.numberOfUserAnswers = data.rsis.length;
            data.rs.numberOfCorrectAnswers = data.rsis.filter((item) => {
                return item.useranswer === item.correctanswer;
            }).length;
            data.rs.numberOfReadingCorrectAnswers = getNumberOfQuestionCorrectBySkill(data.rsis, Skill.Reading);
            data.rs.numberOfListeningCorrectAnswers = getNumberOfQuestionCorrectBySkill(data.rsis, Skill.Listening);
            const { reading, listening, total } = (0, utils_1.calculateToeicScore)(data.rs.numberOfReadingCorrectAnswers, data.rs.numberOfListeningCorrectAnswers);
            const session = yield toeic_test_session_model_1.toeicTestSessionModel.findById(data.rs.sessionId);
            if (!session) {
                throw new bad_request_error_1.BadRequestError("Phiên thi không tồn tại.");
            }
            const testRegistration = yield test_registration_model_1.testRegistrationModel.findOne({
                examId: session.toeicTestId,
                userId: data.rs.userId,
            });
            if (!testRegistration) {
                throw new bad_request_error_1.BadRequestError("Bạn chưa đăng ký thi.");
            }
            const bodyForCertificate = {
                name: testRegistration.personalInfo.fullName,
                readingScore: reading,
                listeningScore: listening,
                issueDate: new Date().getTime(),
                expirationDate: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365).getTime(),
                nationalID: testRegistration.personalInfo.idNumber,
            };
            if (!testRegistration) {
                throw new bad_request_error_1.BadRequestError("Bạn chưa đăng ký thi.");
            }
            yield repos_2.default.addAttempt(data.rs.testId, data.rs.userId);
            // Tạo status session là FINISHED cho user (đưa lên trước khi gọi tạo chứng chỉ blockchain)
            yield toeic_test_session_status_1.toeicTestSessionStatusModel.findOneAndUpdate({
                toeicTestSessionId: data.rs.sessionId,
                userId: data.rs.userId,
            }, {
                toeicTestSessionId: data.rs.sessionId,
                userId: data.rs.userId,
                status: toeic_test_session_status_1.ToeicTestSessionStatus.FINISHED,
            }, {
                upsert: true,
                new: true,
            });
            // Gọi tạo chứng chỉ blockchain
            const response = yield axios_1.default.post(`${process.env.BLOCKCHAIN_SERVER_URL}/api/certificates/mint`, bodyForCertificate);
            if (response.status !== 200) {
                throw new bad_request_error_1.BadRequestError("Lỗi khi tạo chứng chỉ.");
            }
            const user = yield user_model_1.userModel.findById(data.rs.userId);
            if (!user) {
                throw new bad_request_error_1.BadRequestError("Người dùng không tồn tại.");
            }
            (0, nodemailer_1.sendResultExam)({
                to: user.email,
                data: {
                    name: testRegistration.personalInfo.fullName,
                    certificate: response.data,
                },
            });
            const certificate = response.data;
            const newResult = yield exam_result_1.examResultModel.create(data.rs); // result
            let rsItems;
            if (newResult) {
                rsItems = data.rsis.map((item) => {
                    return Object.assign(Object.assign({}, item), { examResultId: newResult.id, userId: data.rs.userId });
                });
            }
            const newResults = yield repos_1.default.createMany(rsItems);
            return newResult;
        });
    }
    ExamResultSrv.creataWithItems = creataWithItems;
    function getNumberOfQuestionCorrectBySkill(rsis, skill) {
        const numberOfQuestionCorrectBySkill = rsis.filter((item) => {
            return (mapSkill[skill].includes(item.part) &&
                item.useranswer === item.correctanswer);
        }).length;
        return numberOfQuestionCorrectBySkill;
    }
})(ExamResultSrv || (ExamResultSrv = {}));
exports.default = ExamResultSrv;
