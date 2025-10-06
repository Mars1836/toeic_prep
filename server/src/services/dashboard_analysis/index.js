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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIncomeWithinNDaysSrv = exports.examAttemptWithinNDaysSrv = exports.getNewUserWithinNDaysSrv = exports.getAllAnalysisWithinNDaysSrv = void 0;
const result_model_1 = require("../../models/result.model");
const transaction_model_1 = require("../../models/transaction.model");
const user_model_1 = require("../../models/user.model");
const getAllAnalysisWithinNDaysSrv = (n) => __awaiter(void 0, void 0, void 0, function* () {
    const userUpgrades = yield user_model_1.userModel.find({
        upgradeExpiredDate: {
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * n),
        },
    });
});
exports.getAllAnalysisWithinNDaysSrv = getAllAnalysisWithinNDaysSrv;
const getNewUserWithinNDaysSrv = (n) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.userModel.find({
        createdAt: {
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * n),
        },
    });
    const usersOld = yield user_model_1.userModel.find({
        createdAt: {
            $lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * n),
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * n * 2),
        },
    });
    return {
        current: users.length,
        previous: usersOld.length,
        percentage: Math.round(((users.length - usersOld.length) / usersOld.length) * 100),
    };
});
exports.getNewUserWithinNDaysSrv = getNewUserWithinNDaysSrv;
const examAttemptWithinNDaysSrv = (n) => __awaiter(void 0, void 0, void 0, function* () {
    const exams = yield result_model_1.resultModel.find({
        createdAt: {
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * n),
        },
    });
    const examsOld = yield result_model_1.resultModel.find({
        createdAt: {
            $lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * n),
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * n * 2),
        },
    });
    return {
        current: exams.length,
        previous: examsOld.length,
        percentage: Math.round(((exams.length - examsOld.length) / examsOld.length) * 100),
    };
});
exports.examAttemptWithinNDaysSrv = examAttemptWithinNDaysSrv;
const getIncomeWithinNDaysSrv = (n) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield transaction_model_1.transactionModel.find({
        createdAt: {
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * n),
        },
    });
    const transactionsOld = yield transaction_model_1.transactionModel.find({
        createdAt: {
            $lt: new Date(Date.now() - 1000 * 60 * 60 * 24 * n),
            $gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * n * 2),
        },
    });
    const income = transactions.reduce((acc, transaction) => {
        return acc + transaction.amount;
    }, 0);
    const incomeOld = transactionsOld.reduce((acc, transaction) => {
        return acc + transaction.amount;
    }, 0);
    return {
        current: income,
        previous: incomeOld,
        percentage: Math.round(((income - incomeOld) / incomeOld) * 100),
    };
});
exports.getIncomeWithinNDaysSrv = getIncomeWithinNDaysSrv;
