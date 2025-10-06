"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const exam_result_1 = __importDefault(require("../../../controllers/exam_result"));
const userExamResultRouter = express_1.default.Router();
userExamResultRouter.post("/items", (0, handle_async_1.handleAsync)(exam_result_1.default.creataWithItems));
exports.default = userExamResultRouter;
