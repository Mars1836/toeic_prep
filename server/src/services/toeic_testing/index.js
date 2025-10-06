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
const toeic_testing_model_1 = require("../../models/toeic_testing.model");
const toeic_testing_model_2 = require("../../models/toeic_testing.model");
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("../../utils");
const test_registration_model_1 = require("../../models/test_registration.model");
class ToeicTestingSrv {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const toeicTest = yield toeic_testing_model_1.toeicTestingModel.create(data);
            return toeicTest;
        });
    }
    createMany(dataList) {
        return __awaiter(this, void 0, void 0, function* () {
            const toeicTests = yield toeic_testing_model_1.toeicTestingModel.insertMany(dataList);
            return toeicTests;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return toeic_testing_model_1.toeicTestingModel.findById(id);
        });
    }
    getAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (params.page - 1) * params.limit;
            const [tests, total] = yield Promise.all([
                toeic_testing_model_1.toeicTestingModel
                    .find()
                    .skip(skip)
                    .limit(params.limit)
                    .sort({ createdAt: -1 }),
                toeic_testing_model_1.toeicTestingModel.countDocuments(),
            ]);
            return { tests, total };
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const toeicTest = yield toeic_testing_model_1.toeicTestingModel.findById(id);
            if (!toeicTest)
                return null;
            Object.assign(toeicTest, data);
            yield toeicTest.save();
            return toeicTest;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield toeic_testing_model_1.toeicTestingModel.deleteOne({ _id: id });
            return result.deletedCount > 0;
        });
    }
    getUpcomingTests() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            return toeic_testing_model_1.toeicTestingModel
                .find({
                timeStart: { $gt: now },
                status: "PENDING",
            })
                .sort({ timeStart: 1 });
        });
    }
    getTestsByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return toeic_testing_model_1.toeicTestingModel
                .find({
                timeStart: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            })
                .sort({ timeStart: 1 });
        });
    }
    getTestsByTestCenter(testCenter) {
        return __awaiter(this, void 0, void 0, function* () {
            return toeic_testing_model_1.toeicTestingModel.find({ testCenter }).sort({ timeStart: -1 });
        });
    }
    getTestsByPriceRange(minPrice, maxPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            return toeic_testing_model_1.toeicTestingModel
                .find({
                price: {
                    $gte: minPrice,
                    $lte: maxPrice,
                },
            })
                .sort({ price: 1 });
        });
    }
    getTestsByFilter(filters, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (params.page - 1) * params.limit;
            const [tests, total] = yield Promise.all([
                toeic_testing_model_1.toeicTestingModel
                    .find(filters)
                    .skip(skip)
                    .limit(params.limit)
                    .sort({ createdAt: -1 }),
                toeic_testing_model_1.toeicTestingModel.countDocuments(filters),
            ]);
            return { tests, total };
        });
    }
    // Helper function to format dates in response
    formatDate(test) {
        if (!test)
            return null;
        const formatted = test;
        // Keep original date format in database, only format for response
        formatted.timeStart = (0, moment_1.default)(test.timeStart).format("YYYY-MM-DD HH:mm:ss");
        formatted.timeEnd = (0, moment_1.default)(test.timeEnd).format("YYYY-MM-DD HH:mm:ss");
        formatted.createdAt = (0, moment_1.default)(test.createdAt).format("YYYY-MM-DD HH:mm:ss");
        formatted.updatedAt = (0, moment_1.default)(test.updatedAt).format("YYYY-MM-DD HH:mm:ss");
        return formatted;
    }
    getPendingTestsByUser(userId, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (params.page - 1) * params.limit;
            // Lấy tất cả các kỳ thi pending và đăng ký của user trong một lần query
            const [tests, registrations, total] = yield Promise.all([
                toeic_testing_model_1.toeicTestingModel
                    .find({
                    status: toeic_testing_model_2.TestStatus.PENDING,
                })
                    .skip(skip)
                    .limit(params.limit)
                    .sort({ createdAt: -1 }),
                test_registration_model_1.testRegistrationModel.find({
                    userId: userId,
                }),
                toeic_testing_model_1.toeicTestingModel.countDocuments({
                    status: toeic_testing_model_2.TestStatus.PENDING,
                }),
            ]);
            // Tạo map để lookup nhanh
            const registrationMap = new Map(registrations.map((reg) => [reg.examId, true]));
            // Thêm trường isRegister cho mỗi kỳ thi
            const testsWithRegisterStatus = tests.map((test) => {
                const testObj = (0, utils_1.transformId)(test.toObject());
                return Object.assign(Object.assign({}, testObj), { isRegister: registrationMap.has(test.id) });
            });
            return { tests: testsWithRegisterStatus, total };
        });
    }
}
exports.default = new ToeicTestingSrv();
