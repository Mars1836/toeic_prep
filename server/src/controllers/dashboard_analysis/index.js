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
const dashboard_analysis_1 = require("../../services/dashboard_analysis");
var DashboardAnalysisController;
(function (DashboardAnalysisController) {
    function getNewUserWithinNDays(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { n } = req.query;
            const nDays = Number(n);
            const users = yield (0, dashboard_analysis_1.getNewUserWithinNDaysSrv)(nDays);
            const data = Object.assign(Object.assign({}, users), { message: "Number of new users within " + nDays + " days  " });
            res.status(200).json({ user: data });
        });
    }
    DashboardAnalysisController.getNewUserWithinNDays = getNewUserWithinNDays;
    function examAttemptWithinNDays(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { n } = req.query;
            const nDays = Number(n);
            const exams = yield (0, dashboard_analysis_1.examAttemptWithinNDaysSrv)(nDays);
            const data = Object.assign(Object.assign({}, exams), { message: "Number of exam attempts within " + nDays + " days  " });
            res.status(200).json({ exam: data });
        });
    }
    DashboardAnalysisController.examAttemptWithinNDays = examAttemptWithinNDays;
    function getIncomeWithinNDays(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { n } = req.query;
            const nDays = Number(n);
            const income = yield (0, dashboard_analysis_1.getIncomeWithinNDaysSrv)(nDays);
            const data = Object.assign(Object.assign({}, income), { message: "Number of income within " + nDays + " days  " });
            res.status(200).json({ income: data });
        });
    }
    DashboardAnalysisController.getIncomeWithinNDays = getIncomeWithinNDays;
})(DashboardAnalysisController || (DashboardAnalysisController = {}));
exports.default = DashboardAnalysisController;
