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
const not_found_error_1 = require("../../errors/not_found_error");
const result_model_1 = require("../../models/result.model");
const result_item_model_1 = require("../../models/result_item.model");
const test_model_1 = require("../../models/test.model");
const user_model_1 = require("../../models/user.model");
const utils_1 = require("../../utils");
const part_accuracy_1 = require("../../utils/analyst/part_accuracy");
const score_1 = require("../../utils/analyst/score");
const repos_1 = __importDefault(require("../result_item/repos"));
const repos_2 = __importDefault(require("../test/repos"));
const repos_3 = __importDefault(require("../user/repos"));
var ResultSrv;
(function (ResultSrv) {
    function create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield repos_2.default.checkExist(data.testId);
            if (!isExist) {
                throw new bad_request_error_1.BadRequestError("Bài test không tồn tại.");
            }
            const newResult = yield result_model_1.resultModel.create(data);
            return newResult;
        });
    }
    ResultSrv.create = create;
    function creataWithItems(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield test_model_1.testModel.findById(data.rs.testId);
            if (!test) {
                throw new bad_request_error_1.BadRequestError("Bài test không tồn tại.");
            }
            data.rs.testType = test.type;
            data.rs.numberOfUserAnswers = data.rsis.length;
            data.rs.numberOfCorrectAnswers = data.rsis.filter((item) => {
                return item.useranswer === item.correctanswer;
            }).length;
            const newResult = yield result_model_1.resultModel.create(data.rs); // result
            let rsItems;
            if (newResult) {
                rsItems = data.rsis.map((item) => {
                    return Object.assign(Object.assign({}, item), { resultId: newResult.id, testId: data.rs.testId, testType: data.rs.testType, userId: data.rs.userId });
                });
            }
            const newResults = yield repos_1.default.createMany(rsItems);
            yield repos_2.default.addAttempt(data.rs.testId, data.rs.userId);
            // update user actual score
            const allRsItems = yield result_item_model_1.resultItemModel
                .find({
                userId: data.rs.userId,
            })
                .lean();
            const accuracyByPart = (0, part_accuracy_1.calculateAccuracyByPart)(allRsItems);
            const { listenScore, readScore, } = (0, score_1.getScoreByAccuracy)(accuracyByPart);
            yield user_model_1.userModel.findByIdAndUpdate(data.rs.userId, {
                actualScore: {
                    reading: readScore,
                    listening: listenScore,
                },
            });
            return Object.assign(Object.assign({}, newResult.toObject()), { id: newResult._id, listenScore,
                readScore });
        });
    }
    ResultSrv.creataWithItems = creataWithItems;
    function getByUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExist = yield repos_3.default.checkExist(data.userId);
            if (!isExist) {
                throw new bad_request_error_1.BadRequestError("Người dùng không tồn tại");
            }
            const result = yield result_model_1.resultModel
                .find({
                userId: data.userId,
            })
                .populate("testId")
                .sort({ createdAt: -1 })
                .skip(data.skip || 0)
                .limit(data.limit || 3);
            return result;
        });
    }
    ResultSrv.getByUser = getByUser;
    function getByTest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.testId) {
                throw new not_found_error_1.NotFoundError("TestId phải được cung cấp");
            }
            if (!data.userId) {
                throw new not_found_error_1.NotFoundError("UserId phải được cung cấp");
            }
            const rs = yield result_model_1.resultModel
                .find({
                userId: data.userId,
                testId: data.testId,
            })
                .populate("testId")
                .sort({ createdAt: -1 })
                .skip(data.skip || 0)
                .limit(data.limit || 3);
            return rs;
        });
    }
    ResultSrv.getByTest = getByTest;
    function getById(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.id) {
                throw new not_found_error_1.NotFoundError("Id phải được cung cấp");
            }
            if (!data.userId) {
                throw new not_found_error_1.NotFoundError("UserId phải được cung cấp");
            }
            const rs = yield result_model_1.resultModel.findOne({
                userId: data.userId,
                _id: data.id,
            });
            return rs;
        });
    }
    ResultSrv.getById = getById;
    function deleteById(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.id) {
                throw new not_found_error_1.NotFoundError("Id phải được cung cấp");
            }
            if (!data.userId) {
                throw new not_found_error_1.NotFoundError("UserId phải được cung cấp");
            }
            const rs = yield result_model_1.resultModel.deleteOne({
                userId: data.userId,
                _id: data.id,
            });
            yield repos_1.default.deleteMany(data.id);
            return rs;
        });
    }
    ResultSrv.deleteById = deleteById;
    function getNewResultAnalyst(step, num) {
        return __awaiter(this, void 0, void 0, function* () {
            // Lấy ngày hiện tại
            const currentDate = new Date();
            // Tính ngày bắt đầu
            const startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - step * num);
            const periodStart = (0, utils_1.getStartOfPeriod)(startDate, step);
            const result = yield result_model_1.resultModel.aggregate([
                {
                    // Lọc các transaction từ startDate
                    $match: {
                        createdAt: { $gte: periodStart },
                    },
                },
                {
                    // Thêm trường period để nhóm
                    $addFields: {
                        periodStart: {
                            $subtract: [
                                { $toDate: "$createdAt" },
                                {
                                    $mod: [
                                        { $subtract: [{ $toDate: "$createdAt" }, periodStart] },
                                        step * 24 * 60 * 60 * 1000,
                                    ],
                                },
                            ],
                        },
                    },
                },
                {
                    // Nhóm theo period và tính tổng amount
                    $group: {
                        _id: "$periodStart",
                        count: { $sum: 1 },
                    },
                },
                {
                    // Sắp xếp theo thời gian
                    $sort: {
                        _id: 1,
                    },
                },
            ]);
            // Format lại kết quả và tính growth rate
            const formattedResult = [];
            let currentPeriod = new Date(periodStart);
            let previousAmount = null;
            for (let i = 0; i < num; i++) {
                const periodEnd = new Date(currentPeriod);
                periodEnd.setDate(periodEnd.getDate() + step - 1);
                // Tìm data tương ứng trong result
                const periodData = result.find((item) => item._id.getTime() === currentPeriod.getTime());
                const currentCount = periodData ? periodData.count : 0;
                // Tính growth rate
                let growthRate = null;
                if (previousAmount !== null && previousAmount !== 0) {
                    growthRate = ((currentCount - previousAmount) / previousAmount) * 100;
                }
                else if (previousAmount === 0 && currentCount !== 0) {
                    growthRate = 100;
                }
                else if (previousAmount === 0 && currentCount === 0) {
                    growthRate = 0;
                }
                formattedResult.push({
                    period: `${(0, utils_1.formatDate)(currentPeriod)} - ${(0, utils_1.formatDate)(periodEnd)}`,
                    startDate: currentPeriod.toISOString(),
                    endDate: periodEnd.toISOString(),
                    totalAmount: currentCount,
                    count: periodData ? periodData.count : 0,
                    growthRate: growthRate !== null ? Number(growthRate.toFixed(2)) : null, // Làm tròn đến 2 chữ số thập phân
                    previousAmount: previousAmount, // Optional, có thể bỏ nếu không cần
                });
                // Lưu lại amount hiện tại để tính growth rate cho period tiếp theo
                previousAmount = currentCount;
                // Chuyển sang period tiếp theo
                currentPeriod.setDate(currentPeriod.getDate() + step);
            }
            return formattedResult;
        });
    }
    ResultSrv.getNewResultAnalyst = getNewResultAnalyst;
    function getUserProgressAnalyst(step, num) {
        return __awaiter(this, void 0, void 0, function* () {
            const totalResult = yield result_model_1.resultModel.countDocuments();
            return {
                totalResult,
            };
        });
    }
    ResultSrv.getUserProgressAnalyst = getUserProgressAnalyst;
})(ResultSrv || (ResultSrv = {}));
exports.default = ResultSrv;
