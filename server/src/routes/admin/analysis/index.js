"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const dashboard_analysis_1 = __importDefault(require("../../../controllers/dashboard_analysis"));
const adminAnalysisRouter = express_1.default.Router();
adminAnalysisRouter.get("/new-user", (0, handle_async_1.handleAsync)(dashboard_analysis_1.default.getNewUserWithinNDays));
adminAnalysisRouter.get("/exam-attempt", (0, handle_async_1.handleAsync)(dashboard_analysis_1.default.examAttemptWithinNDays));
adminAnalysisRouter.get("/income", (0, handle_async_1.handleAsync)(dashboard_analysis_1.default.getIncomeWithinNDays));
exports.default = adminAnalysisRouter;
