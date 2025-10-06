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
const enum_1 = require("../../configs/enum");
const transaction_model_1 = require("../../models/transaction.model");
const utils_1 = require("../../utils");
const repos_1 = __importDefault(require("../user/repos"));
var TransactionSrv;
(function (TransactionSrv) {
    function updateStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const oldTransaction = yield transaction_model_1.transactionModel.findOne({ providerId: id });
            if (!oldTransaction) {
                throw new Error("Transaction not found");
            }
            if ((oldTransaction === null || oldTransaction === void 0 ? void 0 : oldTransaction.status) === status) {
                return oldTransaction;
            }
            if (status === enum_1.TransactionStatus.success) {
                yield repos_1.default.upgrade(oldTransaction === null || oldTransaction === void 0 ? void 0 : oldTransaction.userId);
            }
            const transaction = yield transaction_model_1.transactionModel.findOneAndUpdate({ providerId: id }, { status }, { new: true });
            return transaction;
        });
    }
    TransactionSrv.updateStatus = updateStatus;
    function create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const initData = Object.assign(Object.assign({}, data), { status: enum_1.TransactionStatus.pending });
            const newTransaction = yield transaction_model_1.transactionModel.create(initData);
            return newTransaction;
        });
    }
    TransactionSrv.create = create;
    function updateByProviderId(providerId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTransaction = yield transaction_model_1.transactionModel.findOneAndUpdate({ providerId }, data, {
                new: true,
            });
            return updatedTransaction;
        });
    }
    TransactionSrv.updateByProviderId = updateByProviderId;
    function getTransactionsLast7Months() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const sevenMonthsAgo = new Date();
            sevenMonthsAgo.setMonth(now.getMonth() - 7);
            const stats = yield transaction_model_1.transactionModel.aggregate([
                // Lọc giao dịch trong 7 tháng trước
                {
                    $match: {
                        createdAt: { $gte: sevenMonthsAgo, $lte: now },
                    },
                },
                // Nhóm theo tháng và năm
                {
                    $group: {
                        _id: {
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" },
                        },
                        totalAmount: { $sum: "$amount" }, // Tổng số tiền giao dịch
                        count: { $sum: 1 }, // Tổng số giao dịch
                    },
                },
                // Sắp xếp theo thứ tự thời gian
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]);
            return stats;
        });
    }
    TransactionSrv.getTransactionsLast7Months = getTransactionsLast7Months;
    function getTransactionLast7Days() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            const stats = yield transaction_model_1.transactionModel.aggregate([
                // Lọc giao dịch trong 7 ngày trước
                {
                    $match: {
                        createdAt: { $gte: sevenDaysAgo, $lte: now },
                    },
                },
                // Nhóm theo ngày
                {
                    $group: {
                        _id: {
                            day: { $dayOfMonth: "$createdAt" },
                            month: { $month: "$createdAt" },
                            year: { $year: "$createdAt" },
                        },
                        totalAmount: { $sum: "$amount" },
                        count: { $sum: 1 },
                    },
                },
                // Sắp xếp theo ngày
                { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
            ]);
            return stats;
        });
    }
    TransactionSrv.getTransactionLast7Days = getTransactionLast7Days;
    function getTransactionLast7Years() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const sevenYearsAgo = new Date();
            sevenYearsAgo.setFullYear(now.getFullYear() - 7);
            const stats = yield transaction_model_1.transactionModel.aggregate([
                // Lọc giao dịch trong 7 năm trước
                {
                    $match: {
                        createdAt: { $gte: sevenYearsAgo, $lte: now },
                    },
                },
                // Nhóm theo năm
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" } },
                        totalAmount: { $sum: "$amount" },
                        count: { $sum: 1 },
                    },
                },
                // Sắp xếp theo năm
                { $sort: { "_id.year": 1 } },
            ]);
            return stats;
        });
    }
    TransactionSrv.getTransactionLast7Years = getTransactionLast7Years;
    function getTransactions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield transaction_model_1.transactionModel
                .find(query)
                .populate("userId")
                .sort({ createdAt: -1 });
            return transactions;
        });
    }
    TransactionSrv.getTransactions = getTransactions;
    function getNewTransactionAnalyst(step, num) {
        return __awaiter(this, void 0, void 0, function* () {
            // Lấy ngày hiện tại
            const currentDate = new Date();
            // Tính ngày bắt đầu
            const startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - step * num);
            const periodStart = (0, utils_1.getStartOfPeriod)(startDate, step);
            const result = yield transaction_model_1.transactionModel.aggregate([
                {
                    // Lọc các transaction từ startDate
                    $match: {
                        createdAt: { $gte: periodStart },
                        status: enum_1.TransactionStatus.success,
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
                        totalAmount: { $sum: "$amount" },
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
                const currentAmount = periodData ? periodData.totalAmount : 0;
                // Tính growth rate
                let growthRate = null;
                if (previousAmount !== null && previousAmount !== 0) {
                    growthRate = ((currentAmount - previousAmount) / previousAmount) * 100;
                }
                else if (previousAmount === 0 && currentAmount !== 0) {
                    growthRate = 100;
                }
                else if (previousAmount === 0 && currentAmount === 0) {
                    growthRate = 0;
                }
                formattedResult.push({
                    period: `${(0, utils_1.formatDate)(currentPeriod)} - ${(0, utils_1.formatDate)(periodEnd)}`,
                    startDate: currentPeriod.toISOString(),
                    endDate: periodEnd.toISOString(),
                    totalAmount: currentAmount,
                    count: periodData ? periodData.count : 0,
                    growthRate: growthRate !== null ? Number(growthRate.toFixed(2)) : null, // Làm tròn đến 2 chữ số thập phân
                    previousAmount: previousAmount, // Optional, có thể bỏ nếu không cần
                });
                // Lưu lại amount hiện tại để tính growth rate cho period tiếp theo
                previousAmount = currentAmount;
                // Chuyển sang period tiếp theo
                currentPeriod.setDate(currentPeriod.getDate() + step);
            }
            return formattedResult;
        });
    }
    TransactionSrv.getNewTransactionAnalyst = getNewTransactionAnalyst;
    function getProgressTransactionAnalyst() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalAmount = yield transaction_model_1.transactionModel.aggregate([
                {
                    $match: { status: enum_1.TransactionStatus.success },
                },
                {
                    $group: {
                        _id: null, // Không phân nhóm theo bất kỳ trường nào
                        totalAmount: { $sum: "$amount" },
                    },
                },
            ]);
            const numSuccessTransaction = yield transaction_model_1.transactionModel.countDocuments({
                status: enum_1.TransactionStatus.success,
            });
            return {
                totalAmount: totalAmount[0].totalAmount,
                totalTransaction: numSuccessTransaction,
            };
        });
    }
    TransactionSrv.getProgressTransactionAnalyst = getProgressTransactionAnalyst;
})(TransactionSrv || (TransactionSrv = {}));
exports.default = TransactionSrv;
