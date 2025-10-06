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
const transaction_1 = __importDefault(require("../../services/transaction"));
var TransactionCtrl;
(function (TransactionCtrl) {
    function getTransactionsLast7Months(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield transaction_1.default.getTransactionsLast7Months();
            res.status(200).json(stats);
        });
    }
    TransactionCtrl.getTransactionsLast7Months = getTransactionsLast7Months;
    function getTransactionsLast7Days(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield transaction_1.default.getTransactionLast7Days();
            res.status(200).json(stats);
        });
    }
    TransactionCtrl.getTransactionsLast7Days = getTransactionsLast7Days;
    function getTransactionsLast7Years(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield transaction_1.default.getTransactionLast7Years();
            res.status(200).json(stats);
        });
    }
    TransactionCtrl.getTransactionsLast7Years = getTransactionsLast7Years;
    function getTransactions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield transaction_1.default.getTransactions(req.query);
            res.status(200).json(transactions);
        });
    }
    TransactionCtrl.getTransactions = getTransactions;
    function getNewTransactionAnalyst(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { step, num } = req.query;
            const stats = yield transaction_1.default.getNewTransactionAnalyst(Number(step), Number(num));
            res.status(200).json(stats);
        });
    }
    TransactionCtrl.getNewTransactionAnalyst = getNewTransactionAnalyst;
    function getProgressTransaction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const stats = yield transaction_1.default.getProgressTransactionAnalyst();
            res.status(200).json(stats);
        });
    }
    TransactionCtrl.getProgressTransaction = getProgressTransaction;
    function updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, status } = req.body;
            const transaction = yield transaction_1.default.updateStatus(id, status);
            res.status(200).json(transaction);
        });
    }
    TransactionCtrl.updateStatus = updateStatus;
})(TransactionCtrl || (TransactionCtrl = {}));
exports.default = TransactionCtrl;
