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
const test_registration_model_1 = require("../../models/test_registration.model");
const toeic_testing_model_1 = require("../../models/toeic_testing.model");
const toeic_testing_1 = __importDefault(require("../toeic_testing"));
const TestRegistrationSrv = {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const toeicTest = yield toeic_testing_1.default.getById(data.examId);
            if (!toeicTest) {
                throw new Error("TOEIC test not found");
            }
            const existingRegistration = yield test_registration_model_1.testRegistrationModel.findOne({
                userId: data.userId,
                examId: data.examId,
            });
            if (existingRegistration) {
                throw new Error("Registration already exists");
            }
            const registration = yield test_registration_model_1.testRegistrationModel.create(data);
            return registration;
        });
    },
    getAll() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10) {
            const skip = (page - 1) * limit;
            const [registrations, total] = yield Promise.all([
                test_registration_model_1.testRegistrationModel
                    .find()
                    .populate("userId", "fullName email")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                test_registration_model_1.testRegistrationModel.countDocuments(),
            ]);
            return { registrations, total };
        });
    },
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const registration = yield test_registration_model_1.testRegistrationModel
                .findById(id)
                .populate("userId", "fullName email");
            return registration;
        });
    },
    getByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrations = yield test_registration_model_1.testRegistrationModel
                .find({ userId })
                .populate("userId", "fullName email")
                .sort({ createdAt: -1 });
            return registrations;
        });
    },
    getUpcomingRegistrations() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentDate = new Date();
            const registrations = yield test_registration_model_1.testRegistrationModel
                .find({
                "examInfo.examDate": { $gte: currentDate.toISOString().split("T")[0] },
                "examInfo.status": { $in: [toeic_testing_model_1.TestStatus.PENDING] },
            })
                .populate("userId", "fullName email");
            return registrations;
        });
    },
    updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const registration = yield test_registration_model_1.testRegistrationModel
                .findByIdAndUpdate(id, { "examInfo.status": status }, { new: true })
                .populate("userId", "fullName email");
            return registration;
        });
    },
    getRegistrationsByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrations = yield test_registration_model_1.testRegistrationModel
                .find({
                "examInfo.examDate": {
                    $gte: startDate,
                    $lte: endDate,
                },
            })
                .populate("userId", "fullName email");
            return registrations;
        });
    },
    getRegistrationsByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrations = yield test_registration_model_1.testRegistrationModel
                .find({
                "examInfo.status": status,
            })
                .populate("userId", "fullName email")
                .sort({ createdAt: -1 });
            return registrations;
        });
    },
    getRegistrationsByTestCenter(testCenter) {
        return __awaiter(this, void 0, void 0, function* () {
            const registrations = yield test_registration_model_1.testRegistrationModel
                .find({
                "examInfo.testCenter": testCenter,
            })
                .populate("userId", "fullName email")
                .sort({ "examInfo.examDate": 1 });
            return registrations;
        });
    },
};
exports.default = TestRegistrationSrv;
